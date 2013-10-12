<?php
if (file_exists("../include/elation.php")) {
  require_once("../include/elation.php");
} else {
  require_once("elation.php");
}
$root = preg_replace("|/htdocs$|", "", getcwd());
chdir($root);
elation_readpaths($root);

include_once("include/webapp_class.php");
include_once("lib/profiler.php");

Profiler::StartTimer("Total");
$req = array();
if (!empty($_GET)) {
  if (isset($_GET["path"])) {
    unset($_GET["path"]);
  }
  $req = array_merge($req, $_GET);
}
if (!empty($_POST)) {
  $req = array_merge($req, $_POST);
}
$webapp = new WebApp($root, $req);
$webapp->Display();
Profiler::StopTimer("Total");

if (!empty($_REQUEST["_timing"])) {
  print Profiler::Display();
}
