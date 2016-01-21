elation.require([], function() {
  elation.define('utils.workerpool', {
    src: false,
    num: 4,
    pool: false,
    queue: false,

    _construct: function(args) {
      elation.class.call(this, args);

      this.clearQueue();
      this.createWorkers();
    },
    clearQueue: function() {
      this.queue = [];
      this.promises = {};
    },
    createWorkers: function() {
      this.pool = [];
      if (this.src) {
        for (var i = 0; i < this.num; i++) {
          var worker = new Worker(this.src);
          elation.events.add(worker, 'message', elation.bind(this, this.workerMessage));
          this.pool.push(worker);
          this.update();
        }
      }
    },
    addJob: function(jobdata) {
      var promise = new Promise(elation.bind(this, function(resolve, reject) {
        var jobid = this.getJobID();
        this.promises[jobid] = {resolve: resolve, reject: reject};
        this.queue.push({id: jobid, data: jobdata});
        this.update();
      }));
      return promise;
    },
    update: function() {
      if (this.queue.length > 0 && this.pool.length > 0) {
        // If we have pending items and an available worker, let's go
        var worker = this.pool.shift();
        var job = this.queue.shift();
        worker.postMessage(job);
      }
    },
    getJobID: function() {
      return Math.round(Math.random() * 1e10);
    },
    workerMessage: function(ev) {
      if (ev.data.message == 'finished') {
        // return worker to pool
        var id = ev.data.id,
            data = ev.data.data;
        if (this.promises[id]) {
          this.promises[id].resolve(data);
          delete this.promises[id];
        }
        this.pool.push(ev.target);
        this.update();
      }
    }
  });
});
