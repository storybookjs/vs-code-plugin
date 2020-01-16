module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/extension.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/connected-domain/index.js":
/*!************************************************!*\
  !*** ./node_modules/connected-domain/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__( /*! ./lib/connected-domain */ "./node_modules/connected-domain/lib/connected-domain.js" );

/***/ }),

/***/ "./node_modules/connected-domain/lib/connected-domain.js":
/*!***************************************************************!*\
  !*** ./node_modules/connected-domain/lib/connected-domain.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * calculate all the connected domains based on the given two-dimensional array
 */

/**
 * @param {Array} tdArray
 * @param {Function} indicator It receive the raw point data as the first parameter and decide what kind of domain the point belongs to, it should return a string as a domain identifier.
 * @param {Boolean} hardlink If use hard link. Default to false.
 * @return {Object} [{ bounding: { w: 12, h: 19, x: 0, y: 1 }, points: [ { x: 1, y: 2, point: {} } ], identifier: 'blue', domainId: 1 } ]
 */
module.exports = function( tdArray, indicator, hardlink ){

    hardlink = hardlink || false;

    if( !tdArray ){
        throw new Error( 'tdArray must be provided' );
    }

    if( !indicator ){
        throw new Error( 'indicator must be provided' );
    }

    // clone 一份数据，因为需要对饮用进行修改，方便执行
    tdArray = JSON.parse( JSON.stringify( tdArray ) );

    // Result
    var domains = {};
    var domainUUID = 0;
    var pointsHash = {};

    // 遍历数组，划分domain

    tdArray.forEach(function( row, y ){

        row.forEach(function( colItem, x ){

            // get the current point identifier.
            var identifier = indicator( colItem, x, y );

            // get neighbours
            // Except for Undefined every data type is valid.
            var neighbours = [];

            // top neighbour
            if( tdArray[ y - 1 ] && tdArray[ y - 1 ][ x ] !== undefined ){
                neighbours.push( pointsHash[ x + '_' + ( y - 1 ) ] );
            }

            // left neighbour
            if( row[ x - 1 ] !== undefined ){
                neighbours.push( pointsHash[ ( x - 1 ) + '_' + y ] );
            }

            // soft link will treat corner link as domain link.
            if( !hardlink ){
                // top left neighbour
                if( tdArray[ y - 1 ] && tdArray[ y - 1 ][ x - 1 ] !== undefined ){
                    neighbours.push( pointsHash[ ( x - 1 ) + '_' + ( y - 1 ) ] );
                }

                // top right neighbour
                if( tdArray[ y - 1 ] && tdArray[ y - 1 ][ x + 1 ] !== undefined ){
                    neighbours.push( pointsHash[ ( x + 1 ) + '_' + ( y - 1 ) ] );
                }
            }

            if( neighbours.length ){
                var matched = false;

                neighbours.forEach(function( neighbour ){

                    if( neighbour.identifier == identifier ){

                        // If the neighbour is the first neighbour has the same identifier
                        if( !matched ){
                            addPointToDomain( colItem, x, y, neighbour.domainId );
                            matched = true;
                        }

                        // If more than one neighbour matched, check if these neighbours belong to the same domain
                        // If not, merge these domains since they connects to each other.
                        else {
                            var colItemPoint = pointsHash[ x + '_' + y ];
                            if( neighbour.domainId != colItemPoint.domainId ){
                                mergeDomains( neighbour.domainId, colItemPoint.domainId );
                            }
                        }
                    }
                });

                if( !matched ){
                    addNewDomain( colItem, x, y, identifier );
                }
            }
            else {
                addNewDomain( colItem, x, y, identifier );
            }
        });
    });

    // some summary
    var result = {
        domains: [],
        totalDomains: 0,
        groupByIdentifier: {},
        totalIdentifiers: 0
    };

    var domainId = null;
    var identifier = null;
    var domain = null;
    for( domainId in domains ){
        domain = domains[ domainId ];
        domain.bounding = calculateBounding( domain.points );
        identifier = domain.identifier;

        result.domains.push( domain );
        result.totalDomains++;

        if( !( identifier in result.groupByIdentifier ) ){
            result.groupByIdentifier[ identifier ] = [];
            result.totalIdentifiers++;
        }

        result.groupByIdentifier[ identifier ].push( domain );
    }


    function calculateBounding( points ){

        var minX = null;
        var minY = null;
        var maxX = null;
        var maxY = null;

        points.forEach(function( point ){

            if( minX === null || point.x < minX ){
                minX = point.x;
            }

            if( minY === null || point.y < minY ){
                minY = point.y;
            }

            if( maxX === null || point.x > maxX ){
                maxX = point.x;
            }

            if( maxY === null || point.y > maxY ){
                maxY = point.y;
            }
        });

        var w = maxX - minX;
        var h = maxY - minY;

        return {
            x: minX,
            y: minY,
            w: w,
            h: h
        };
    }

    /**
     *
     * @param point
     * @param x
     * @param y
     * @param identifier
     */
    function addNewDomain( point, x, y, identifier ){

        var newDomain = {
            identifier: identifier,
            domainId: ++domainUUID,
            bounding: {},
            points: []
        };

        var newPoint = {
            value: point,
            x: x,
            y: y,
            identifier: identifier,
            domainId: newDomain.domainId
        };

        pointsHash[ x + '_' + y ] = {
            value: point,
            identifier: identifier,
            domainId: newDomain.domainId
        };

        newDomain.points.push( newPoint );

        domains[ newDomain.domainId ] = newDomain;
    }

    /**
     * add a point to a existing domain, and attach properties domainId and identifier to point.
     * @param point
     * @param x
     * @param y
     * @param domainId
     */
    function addPointToDomain( point, x, y, domainId ){

        var domain = domains[ domainId ];
        var newPoint = {
            value: point,
            x: x,
            y: y,
            identifier: domain.identifier,
            domainId: domainId
        };

        pointsHash[ x + '_' + y ] = {
            value: point,
            identifier: domain.identifier,
            domainId: domainId
        };

        domain.points.push( newPoint );
    }

    /**
     * 将 domainB 合并到 domainA
     * @param domainAId
     * @param domainBId
     */
    function mergeDomains( domainAId, domainBId ){

        var domainA = domains[ domainAId ];
        var domainB = domains[ domainBId ];

        if( domainA.identifier == domainB.identifier ){
            // 更新 domainB 的domainId

            domainB.domainId = domainA.domainId;

            domainB.points.forEach(function( point ){
                point.domainId = domainA.domainId;
                pointsHash[ point.x + '_' + point.y ].domainId = domainA.domainId;
            });

            domainA.points = domainA.points.concat( domainB.points );

            // 删除domainB
            delete domains[ domainBId ];
        }
    }

    return result;
};

/***/ }),

/***/ "./node_modules/ps-node/index.js":
/*!***************************************!*\
  !*** ./node_modules/ps-node/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib */ "./node_modules/ps-node/lib/index.js");


/***/ }),

/***/ "./node_modules/ps-node/lib/index.js":
/*!*******************************************!*\
  !*** ./node_modules/ps-node/lib/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var ChildProcess = __webpack_require__(/*! child_process */ "child_process");
var IS_WIN = process.platform === 'win32';
var TableParser = __webpack_require__(/*! table-parser */ "./node_modules/table-parser/index.js");
/**
 * End of line.
 * Basically, the EOL should be:
 * - windows: \r\n
 * - *nix: \n
 * But i'm trying to get every possibilities covered.
 */
var EOL = /(\r\n)|(\n\r)|\n|\r/;
var SystemEOL = __webpack_require__(/*! os */ "os").EOL;

/**
 * Execute child process
 * @type {Function}
 * @param {String[]} args
 * @param {Function} callback
 * @param {Object=null} callback.err
 * @param {Object[]} callback.stdout
 */

var Exec = module.exports = exports = function (args, callback) {
  var spawn = ChildProcess.spawn;

  // on windows, if use ChildProcess.exec(`wmic process get`), the stdout will gives you nothing
  // that's why I use `cmd` instead
  if (IS_WIN) {

    var CMD = spawn('cmd');
    var stdout = '';
    var stderr = null;

    CMD.stdout.on('data', function (data) {
      stdout += data.toString();
    });

    CMD.stderr.on('data', function (data) {

      if (stderr === null) {
        stderr = data.toString();
      }
      else {
        stderr += data.toString();
      }
    });

    CMD.on('exit', function () {

      var beginRow;
      stdout = stdout.split(EOL);

      // Find the line index for the titles
      stdout.forEach(function (out, index) {
        if (out && typeof beginRow == 'undefined' && out.indexOf('CommandLine') === 0) {
          beginRow = index;
        }
      });

      // get rid of the start (copyright) and the end (current pwd)
      stdout.splice(stdout.length - 1, 1);
      stdout.splice(0, beginRow);

      callback(stderr, stdout.join(SystemEOL) || false);
    });

    CMD.stdin.write('wmic process get ProcessId,ParentProcessId,CommandLine \n');
    CMD.stdin.end();
  }
  else {
    if (typeof args === 'string') {
      args = args.split(/\s+/);
    }
    const child = spawn('ps', args);
    var stdout = '';
    var stderr = null;

    child.stdout.on('data', function (data) {
      stdout += data.toString();
    });

    child.stderr.on('data', function (data) {

      if (stderr === null) {
        stderr = data.toString();
      }
      else {
        stderr += data.toString();
      }
    });

    child.on('exit', function () {
      if (stderr) {
        return callback(stderr.toString());
      }
      else {
        callback(null, stdout || false);
      }
    });
  }
};

/**
 * Query Process: Focus on pid & cmd
 * @param query
 * @param {String|String[]} query.pid
 * @param {String} query.command RegExp String
 * @param {String} query.arguments RegExp String
 * @param {String|array} query.psargs
 * @param {Function} callback
 * @param {Object=null} callback.err
 * @param {Object[]} callback.processList
 * @return {Object}
 */

exports.lookup = function (query, callback) {

  /**
   * add 'lx' as default ps arguments, since the default ps output in linux like "ubuntu", wont include command arguments
   */
  var exeArgs = query.psargs || ['lx'];
  var filter = {};
  var idList;

  // Lookup by PID
  if (query.pid) {

    if (Array.isArray(query.pid)) {
      idList = query.pid;
    }
    else {
      idList = [query.pid];
    }

    // Cast all PIDs as Strings
    idList = idList.map(function (v) {
      return String(v);
    });

  }


  if (query.command) {
    filter['command'] = new RegExp(query.command, 'i');
  }

  if (query.arguments) {
    filter['arguments'] = new RegExp(query.arguments, 'i');
  }

  if (query.ppid) {
    filter['ppid'] = new RegExp(query.ppid);
  }

  return Exec(exeArgs, function (err, output) {
    if (err) {
      return callback(err);
    }
    else {
      var processList = parseGrid(output);
      var resultList = [];

      processList.forEach(function (p) {

        var flt;
        var type;
        var result = true;

        if (idList && idList.indexOf(String(p.pid)) < 0) {
          return;
        }

        for (type in filter) {
          flt = filter[type];
          result = flt.test(p[type]) ? result : false;
        }

        if (result) {
          resultList.push(p);
        }
      });

      callback(null, resultList);
    }
  });
};

/**
 * Kill process
 * @param pid
 * @param {Object|String} signal
 * @param {String} signal.signal
 * @param {number} signal.timeout
 * @param next
 */

exports.kill = function( pid, signal, next ){
  //opts are optional
  if(arguments.length == 2 && typeof signal == 'function'){
    next = signal;
    signal = undefined;
  }

  var checkTimeoutSeconds = (signal && signal.timeout) || 30;

  if (typeof signal === 'object') {
    signal = signal.signal;
  }

  try {
    process.kill(pid, signal);
  } catch(e) {
    return next && next(e);
  }

  var checkConfident = 0;
  var checkTimeoutTimer = null;
  var checkIsTimeout = false;

  function checkKilled(finishCallback) {
    exports.lookup({ pid: pid }, function(err, list) {
      if (checkIsTimeout) return;

      if (err) {
        clearTimeout(checkTimeoutTimer);
        finishCallback && finishCallback(err);
      } else if(list.length > 0) {
        checkConfident = (checkConfident - 1) || 0;
        checkKilled(finishCallback);
      } else {
        checkConfident++;
        if (checkConfident === 5) {
          clearTimeout(checkTimeoutTimer);
          finishCallback && finishCallback();
        } else {
          checkKilled(finishCallback);
        }
      }
    });
  }

  next && checkKilled(next);

  checkTimeoutTimer = next && setTimeout(function() {
    checkIsTimeout = true;
    next(new Error('Kill process timeout'));
  }, checkTimeoutSeconds * 1000);
};

/**
 * Parse the stdout into readable object.
 * @param {String} output
 */

function parseGrid(output) {
  if (!output) {
    return [];
  }
  return formatOutput(TableParser.parse(output));
}

/**
 * format the structure, extract pid, command, arguments, ppid
 * @param data
 * @return {Array}
 */

function formatOutput(data) {
  var formatedData = [];
  data.forEach(function (d) {
    var pid = ( d.PID && d.PID[0] ) || ( d.ProcessId && d.ProcessId[0] ) || undefined;
    var cmd = d.CMD || d.CommandLine || d.COMMAND || undefined;
    var ppid = ( d.PPID && d.PPID[0] ) || ( d.ParentProcessId && d.ParentProcessId[0] ) || undefined;

    if (pid && cmd) {
      var command = cmd[0];
      var args = '';

      if (cmd.length > 1) {
        args = cmd.slice(1);
      }

      formatedData.push({
        pid: pid,
        command: command,
        arguments: args,
        ppid: ppid
      });
    }
  });

  return formatedData;
}


/***/ }),

/***/ "./node_modules/table-parser/index.js":
/*!********************************************!*\
  !*** ./node_modules/table-parser/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__( /*! ./lib/index */ "./node_modules/table-parser/lib/index.js" );

/***/ }),

/***/ "./node_modules/table-parser/lib/index.js":
/*!************************************************!*\
  !*** ./node_modules/table-parser/lib/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 *
 * 1, define the edge ( begin and end ) of every title field
 * 2, parse all the lines except the title line, get all the connected-domains
 * 3, group all the connected-domains vertically overlapped.
 * 4, a domain group belongs to a title field if they vertically overlapped
 * 5, calculate all the edge info through the group domain and title field relations.
 */
var ConnectedDomain = __webpack_require__(/*! connected-domain */ "./node_modules/connected-domain/index.js");
var EMPTY_EX = /\s/;

/**
 * The output sting of cmd to parse
 * @param output
 * @returns {Array}
 */
module.exports.parse = function (output) {

  // Split into lines
  // Basically, the EOL should be:
  // - windows: \r\n
  // - *nix: \n
  // But i'm trying to get every possibilities covered.
  var linesTmp = output.split(/(\r\n)|(\n\r)|\n|\r/);

  // valid lines
  var lines = [];
  // title field info, mapped with filed name.
  var titleInfo = {};
  // the two dimensional array of the lines
  var twoDimArray = [];

  // get rid of all the empty lines.
  linesTmp.forEach(function (line) {
    if (line && line.trim()) {
      lines.push(line);
    }
  });

  // build title fields edge info
  // build two dimensional array for Connected-Domain to parse.
  lines.forEach(function (line, index) {

    // Treat the first line as the title fields line
    if (index == 0) {
      var fields = line.split(/\s+/);

      // record the beginning and ending for each field
      fields.forEach(function (field, idx) {

        if (field) {
          var info = titleInfo[field] = {};
          var indexBegin = line.indexOf(field);
          var indexEnd = indexBegin + field.length;

          if (idx == 0) {
            info.titleBegin = 0;
          }
          else {
            info.titleBegin = indexBegin;
          }

          if (idx == fields.length - 1) {
            info.titleEnd = line.length - 1;
          }
          else {
            info.titleEnd = indexEnd;
          }
        }
      });
    }
    else {
      twoDimArray[index - 1] = line.split('');
    }
  });

  // In the connected-domain aspect of view, all the blanks are connected, and all the non-blanks are connected.
  var connectedDomains = ConnectedDomain(twoDimArray, function (value) {
    if (EMPTY_EX.test(value)) {
      return -1;
    }
    else {
      return 1;
    }
  }, true);

  // all the connected domains grouped if they are vertically overlapped.
  var valuesDomainsVerticalGroups = [];

  // sore the domain list make 'x' in ascending order, it will prevent the situation that:
  // 1, two domains are not overlapped, so two groups are created for them at first
  // 2, another domain is found overlapped with both of the domains at the first step.
  // 3, In this situation the three groups have to be merged, which is complicated to implement.
  //
  // If the list is sorted in this order, this situation can't happen, because:
  // - 1, If two non-overlapped domains A, B ( the "x" value of A less than B ) are found first.
  // - 2, Since the list is in 'x' ascending order, the 'x' values of the following domains must larger or equal to the "x" of B, which means they will never overlapped with domain A.
  // - 3, So this situation can't happen.
  connectedDomains.domains.sort(function (a, b) {
    return a.bounding.x - b.bounding.x;
  });

  // Group domains vertically overlapped.
  connectedDomains.domains.forEach(function (domain) {
    // only handle un-empty domain
    if (domain.identifier === 1) {
      var overlapped = false;

      // If overlapped
      valuesDomainsVerticalGroups.forEach(function (group) {
        var bounding = domain.bounding;
        var left = bounding.x;
        var right = bounding.x + bounding.w;

        if (overlap(left, right, group.begin, group.end)) {

          overlapped = true;
          group.domains.push(domain);
          group.begin = group.begin > left ? left : group.begin;
          group.end = group.end < right ? right : group.end;
        }
      });

      // If not overlapped with any group, then create a new group
      if (!overlapped) {
        valuesDomainsVerticalGroups.push({
          begin: domain.bounding.x,
          end: domain.bounding.x + domain.bounding.w,
          domains: [domain]
        });
      }
    }
  });

  // connect all the groups to the title fields
  valuesDomainsVerticalGroups.forEach(function (group) {
    var title = null;
    var info = null;
    var overlapped = false;

    var minimunLeftDistance = null;
    var nearestLeftTitle = null;
    var distance = null;

    for (title in titleInfo) {
      info = titleInfo[title];

      /**
       * The calculation below is to find the nearest left title field to the group, in case no overlapped title field found.
       */
      if (group.begin > info.titleBegin) {
        distance = group.begin - info.titleBegin;

        if (!nearestLeftTitle || ( distance < minimunLeftDistance )) {
          nearestLeftTitle = title;
          minimunLeftDistance = distance;
        }
      }

      if (overlap(group.begin, group.end, info.titleBegin, info.titleEnd)) {

        overlapped = true;
        info.titleBegin = info.titleBegin > group.begin ? group.begin : info.titleBegin;
        info.titleEnd = info.titleEnd < group.end ? group.end : info.titleEnd;
      }
    }

    // Groups not match any title field belongs to the nearest left title field
    if (!overlapped && nearestLeftTitle) {
      var nearestTitleField = titleInfo[nearestLeftTitle];
      nearestTitleField.titleBegin = nearestTitleField.titleBegin > group.begin ? group.begin : nearestTitleField.titleBegin;
      nearestTitleField.titleEnd = nearestTitleField.titleEnd < group.end ? group.end : nearestTitleField.titleEnd;

    }
  });

  // The final result
  var result = [];

  // Since we have got all the title bounding edges, we can split all the lines into values now
  lines.forEach(function (line, index) {
    // skip the first line
    if (index > 0) {

      var lineItem = {};
      var title = null;
      var info = null;
      var value = null;
      for (title in titleInfo) {
        info = titleInfo[title];
        value = line.substring(info.titleBegin, info.titleEnd + 1);
        lineItem[title] = splitValue(value.trim());
      }

      result.push(lineItem);
    }
  });

  return result;
};

/**
 * Test if two bounding overlapped vertically
 * @param begin1
 * @param end1
 * @param begin2
 * @param end2
 * @returns {boolean}
 */
function overlap(begin1, end1, begin2, end2) {
  return ( begin1 > begin2 && begin1 < end2 ) || // 2--1--2--1 or 2--1--1--2
    ( end1 > begin2 && end1 < end2 ) ||     // 1--2--1--2 or 2--1--1--2
    ( begin1 <= begin2 && end1 >= end2 );// 21--12 or 1--2--2--1
}

/**
 * transform a string value into array. It's not just split(), but also to consider some chunk that wrapped with `"`, like below:
 *      "C:\Program Files\Google\Chrome\Application\chrome.exe" --type=renderer --lang=zh-CN, `C:\Program Files\Google\Chrome\Application\chrome.exe` should be treated as a whole,
 *      also, be careful don't be mislead by format like `--name="neekey"`, even more complicated: `--name="Neekey Ni"`
 * so, `"C:\Program Files\Internet Explorer\iexplore.exe" --name="Jack Neekey"` should split into:
 *  - C:\Program Files\Internet Explorer\iexplore.exe  // without `"`
 *  - --name="Jack Neekey"                             // with `"`
 */
function splitValue(value) {

  var match = value.match(/"/g);

  // If only one " found, then just ignore it
  if (!match || match.length == 1) {
    return value.split(/\s+/);
  }
  else {
    var result = [];
    var chunk = null;
    var ifInWrappedChunk = false;
    var ifInPureWrappedChunk = false;
    var quotaCount = 0;

    // If the match length is a even, than nothing special, if a odd, ignore the last one.
    var maxQuotaCount = match.length % 2 == 0 ? match.length : match.length - 1;

    var previousItem = null;
    var values = value.split('');

    values.forEach(function (item, index) {

      if (item !== ' ') {

        if (item === '"') {
          // quota chunk begin
          if (ifInWrappedChunk === false && quotaCount <= maxQuotaCount) {
            ifInWrappedChunk = true;
            quotaCount++;

            // pure quota chunk begin
            if (previousItem === ' ' || previousItem === null) {
              ifInPureWrappedChunk = true;
              chunk = '';
            }
            // normal continue
            else {
              chunk += item;
            }
          }
          // quota chunk end
          else if (ifInWrappedChunk === true) {
            ifInWrappedChunk = false;
            quotaCount++;

            // pure quota chunk end
            if (ifInPureWrappedChunk === true) {
              ifInPureWrappedChunk = false;
              result.push(chunk);
              chunk = null;
            }
            // normal continue
            else {
              chunk += item;
            }
          }
        }
        // normal begin
        else if (ifInWrappedChunk === false && ( previousItem === ' ' || previousItem === null )) {
          chunk = item;
        }
        // normal or quota chunk continue.
        else {
          chunk += item;
        }
      }
      // quota chunk continue, in quota chunk, blank is valid.
      else if (ifInWrappedChunk) {
        chunk += item;
      }
      // if not in quota chunk, them a blank means an end. But make sure chunk is exist, cause that could be blanks at the beginning.
      else if (chunk !== null) {
        result.push(chunk);
        chunk = null;
      }

      previousItem = item;

      // If this is the last one, but chunk is not end
      if (index == ( values.length - 1 ) && chunk !== null) {
        result.push(chunk);
        chunk = null;
      }
    });

    return result;
  }
}


/***/ }),

/***/ "./src/extension.ts":
/*!**************************!*\
  !*** ./src/extension.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(/*! vscode */ "vscode");
const url_1 = __webpack_require__(/*! url */ "url");
const path = __webpack_require__(/*! path */ "path");
const fs = __webpack_require__(/*! fs */ "fs");
const ps = __webpack_require__(/*! ps-node */ "./node_modules/ps-node/index.js");
const child_process = __webpack_require__(/*! child_process */ "child_process");
const events = __webpack_require__(/*! events */ "events");
const os = __webpack_require__(/*! os */ "os");
function activate(context) {
    //define PORT and host variables to feed the webview content from SB server
    let PORT;
    let host = 'localhost';
    const aesopEmitter = new events.EventEmitter();
    const platform = os.platform();
    const commands = {
        linux: {
            cmd: 'netstat',
            args: ['-apntu'],
        },
        darwin: {
            cmd: 'netstat',
            args: ['-v', '-n', '-p', 'tcp'],
        },
        win32: {
            cmd: 'netstat.exe',
            args: ['-a', '-n', '-o'],
        },
    };
    const command = commands[platform];
    //@TODO: if aesop already opened sb in webview - subsequent calls to aesop should not open a new webview
    //set context "aesop-awake" to true; enabling views
    vscode.commands.executeCommand("setContext", "aesop-awake", true);
    //create the status bar to let the user know what Aesop is doing
    const statusText = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 7);
    statusText.text = "Aesop is finding your Storybook dependency...";
    statusText.color = "#FFFFFF";
    statusText.command = undefined;
    statusText.tooltip = "Aesop status";
    //create disposable to register Aesop Awaken command to subscriptions
    let disposable = vscode.commands.registerCommand('extension.aesopAwaken', () => {
        statusText.show();
        //declare variable to toggle whether running Node processes have been checked
        let checkedProcesses = false;
        //declare variable to toggle whether a running SB process was found
        let foundSb = false;
        //define a path to the user's root working directory
        const rootDir = url_1.fileURLToPath(vscode.workspace.workspaceFolders[0].uri.toString(true));
        //first test whether Storybook has been depended into your application
        fs.access(path.join(rootDir, '/node_modules/@storybook'), (err) => {
            //if the filepath isn't found, show the user what Aesop is reading as the root path
            if (err) {
                vscode.window.showErrorMessage(`Aesop could not find Storybook as a dependency in the active folder, ${rootDir}`);
                throw new Error('Error finding a storybook project');
            }
            else {
                statusText.text = "`Aesop found Storybook dependency";
                //check to see if a storybook node process is already running
                ps.lookup({ command: 'node',
                    psargs: 'ux'
                }, (err, resultList) => {
                    if (err) {
                        vscode.window.showErrorMessage(`Failed looking for running Node processes. Error: ${err}`);
                        statusText.dispose();
                        throw new Error('no node process found');
                    }
                    else {
                        //notify the user that Aesop is checking for a running Storybook instances
                        statusText.text = `Reviewing Node processes...`;
                        //if the process lookup was able to find running processes, iterate through to review them
                        resultList.forEach((process) => {
                            //check if any running processes are Storybook processes
                            //stretch feature: check for multiple instances of storybook and reconcile
                            if (process.arguments[0].includes('storybook')) {
                                //if so, extract port number and use that value to populate the webview with that contents
                                const pFlagIndex = process.arguments.indexOf('-p');
                                //also grab the process id to use netstat in the else condition
                                const processPid = parseInt(process['pid']).toString();
                                //if a port flag has been defined in the process args, retrieve the user's config
                                if (pFlagIndex !== -1) {
                                    PORT = parseInt(process.arguments[pFlagIndex + 1]);
                                    aesopEmitter.emit('sb_on');
                                }
                                else {
                                    //if no port flag defined, dynamically retrieve port with netstat
                                    const netStatProcess = child_process.spawn(command.cmd, command.args);
                                    const grepProcess = child_process.spawn('grep', [processPid]);
                                    netStatProcess.stdout.pipe(grepProcess.stdin);
                                    grepProcess.stdout.setEncoding('utf8');
                                    grepProcess.stdout.on('data', (data) => {
                                        const parts = data.split(/\s/).filter(String);
                                        //@TODO: refactor for platform specific or grab port dynamically
                                        const partIndex = (platform === 'win32') ? 2 : 3;
                                        PORT = parseInt(parts[partIndex].replace(/[^0-9]/g, ''));
                                        aesopEmitter.emit('sb_on');
                                    });
                                    netStatProcess.stdout.on('exit', (code) => {
                                        vscode.window.showInformationMessage(`Netstat ended with ${code}`);
                                    });
                                    grepProcess.stdout.on('exit', (code) => {
                                        vscode.window.showInformationMessage(`Grep ended with ${code}`);
                                    });
                                }
                                //set foundSb to true to prevent our function from running another process
                                foundSb = true;
                                //once port is known, fire event emitter to instantiate webview
                                statusText.text = `Retrieving running Storybook process...`;
                            } //---> close if process.arguments[0] contains storybook
                        }); //---> close resultList.forEach()
                        //having checked running Node processes, set that variable to true
                        //if no processes matched 'storybook', we will have to spin up the storybook server
                        if (foundSb === false) {
                            //starts by checking for/extracting any port flags from the SB script in the package.json
                            fs.readFile(path.join(rootDir, 'package.json'), (err, data) => {
                                if (err) {
                                    vscode.window.showErrorMessage(`Aesop is attempting to read ${rootDir}. Is there a package.json file here?`);
                                    statusText.dispose();
                                }
                                else {
                                    statusText.text = `Checking package.json...`;
                                    //enter the package.JSON file and retrieve its contents as an object
                                    let packageJSON = JSON.parse(data.toString());
                                    let storybookScript = packageJSON.scripts.storybook;
                                    //iterate through the text string (stored on "storybook" key) and parse out port flag
                                    //it is more helpful to split it into an array separated by whitespace to grab this
                                    let retrievedScriptArray = storybookScript.split(' ');
                                    //@TODO if script already includes --ci, no need to add it
                                    //older Windows systems support here: check platform, change process command accordingly
                                    let platform = os.platform();
                                    vscode.window.showInformationMessage(`Your platform is ${platform}`);
                                    const sbCLI = './node_modules/.bin/start-storybook';
                                    const sbStartIndex = retrievedScriptArray.indexOf('start-storybook');
                                    retrievedScriptArray[sbStartIndex] = sbCLI;
                                    retrievedScriptArray.push('--ci');
                                    //now launch the child process on the port you've derived
                                    const runSb = child_process.spawn('node', retrievedScriptArray, { cwd: rootDir, detached: false, env: process.env, windowsHide: false, windowsVerbatimArguments: true });
                                    statusText.text = `Done looking. Aesop will now launch Storybook in the background.`;
                                    runSb.stdout.setEncoding('utf8');
                                    let counter = 0;
                                    //Storybook outputs three messages to the terminal as it spins up
                                    //grab the port from the last message to listen in on the process
                                    runSb.stdout.on('data', (data) => {
                                        let str = data.toString();
                                        let lines = str.split(" ");
                                        //vscode.window.showInformationMessage(`lines: ${lines}`);
                                        counter += 1;
                                        if (counter >= 2) {
                                            for (let i = 165; i < lines.length; i += 1) {
                                                if (lines[i].includes('localhost')) {
                                                    const path = lines[i];
                                                    const regExp = (/[^0-9]/g);
                                                    PORT = (path.replace(regExp, ""));
                                                    vscode.window.showInformationMessage(`Storybook is now running on localhost:${PORT}`);
                                                    aesopEmitter.emit('sb_on');
                                                    break;
                                                }
                                            }
                                        }
                                    });
                                    runSb.on('error', (err) => {
                                        console.log(err);
                                        process.exit(1);
                                    });
                                    //make sure the child process is terminated on process exit
                                    runSb.on('close', (code) => {
                                        console.log(`child process exited with code ${code}`);
                                    });
                                }
                            });
                        } //close spin up server
                    }
                    ; //CLOSE else psLookup
                }); //close ps LOOKUP //close depend found, not checked processes
            } //close else statement in fs.access
        }); //close fs access
        aesopEmitter.on('sb_on', () => {
            createAesop(PORT, host);
        });
        function createAesop(PORT, host) {
            statusText.hide();
            vscode.window.showInformationMessage(`Welcome to Aesop Storybook`);
            const panel = vscode.window.createWebviewPanel('aesop-sb', 'Aesop', vscode.ViewColumn.Beside, {
                enableCommandUris: true,
                enableScripts: true,
                portMapping: [{
                        webviewPort: PORT,
                        extensionHostPort: PORT
                    }],
                localResourceRoots: [vscode.Uri.file(context.extensionPath)],
            });
            panel.webview.html = `
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Aesop</title>
					<style>
						html { width: 100%; height: 100%; min-width: 20%; min-height: 20%;}
						body { display: flex; flex-flow: column nowrap; padding: 0; margin: 0; width: 100%' justify-content: center}
					</style>
				</head>
				<body>
					<iframe src="http://${host}:${PORT}" width="100%" height="600"></iframe>
				</body>
			</html>`;
        } // close createAesop helper function
    }); //close disposable
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;


/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),

/***/ "vscode":
/*!*************************!*\
  !*** external "vscode" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("vscode");

/***/ })

/******/ });
//# sourceMappingURL=extension.js.map