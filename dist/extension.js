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

/***/ "./node_modules/ws/index.js":
/*!**********************************!*\
  !*** ./node_modules/ws/index.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const WebSocket = __webpack_require__(/*! ./lib/websocket */ "./node_modules/ws/lib/websocket.js");

WebSocket.createWebSocketStream = __webpack_require__(/*! ./lib/stream */ "./node_modules/ws/lib/stream.js");
WebSocket.Server = __webpack_require__(/*! ./lib/websocket-server */ "./node_modules/ws/lib/websocket-server.js");
WebSocket.Receiver = __webpack_require__(/*! ./lib/receiver */ "./node_modules/ws/lib/receiver.js");
WebSocket.Sender = __webpack_require__(/*! ./lib/sender */ "./node_modules/ws/lib/sender.js");

module.exports = WebSocket;


/***/ }),

/***/ "./node_modules/ws/lib/buffer-util.js":
/*!********************************************!*\
  !*** ./node_modules/ws/lib/buffer-util.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const { EMPTY_BUFFER } = __webpack_require__(/*! ./constants */ "./node_modules/ws/lib/constants.js");

/**
 * Merges an array of buffers into a new buffer.
 *
 * @param {Buffer[]} list The array of buffers to concat
 * @param {Number} totalLength The total length of buffers in the list
 * @return {Buffer} The resulting buffer
 * @public
 */
function concat(list, totalLength) {
  if (list.length === 0) return EMPTY_BUFFER;
  if (list.length === 1) return list[0];

  const target = Buffer.allocUnsafe(totalLength);
  let offset = 0;

  for (let i = 0; i < list.length; i++) {
    const buf = list[i];
    target.set(buf, offset);
    offset += buf.length;
  }

  if (offset < totalLength) return target.slice(0, offset);

  return target;
}

/**
 * Masks a buffer using the given mask.
 *
 * @param {Buffer} source The buffer to mask
 * @param {Buffer} mask The mask to use
 * @param {Buffer} output The buffer where to store the result
 * @param {Number} offset The offset at which to start writing
 * @param {Number} length The number of bytes to mask.
 * @public
 */
function _mask(source, mask, output, offset, length) {
  for (let i = 0; i < length; i++) {
    output[offset + i] = source[i] ^ mask[i & 3];
  }
}

/**
 * Unmasks a buffer using the given mask.
 *
 * @param {Buffer} buffer The buffer to unmask
 * @param {Buffer} mask The mask to use
 * @public
 */
function _unmask(buffer, mask) {
  // Required until https://github.com/nodejs/node/issues/9006 is resolved.
  const length = buffer.length;
  for (let i = 0; i < length; i++) {
    buffer[i] ^= mask[i & 3];
  }
}

/**
 * Converts a buffer to an `ArrayBuffer`.
 *
 * @param {Buffer} buf The buffer to convert
 * @return {ArrayBuffer} Converted buffer
 * @public
 */
function toArrayBuffer(buf) {
  if (buf.byteLength === buf.buffer.byteLength) {
    return buf.buffer;
  }

  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

/**
 * Converts `data` to a `Buffer`.
 *
 * @param {*} data The data to convert
 * @return {Buffer} The buffer
 * @throws {TypeError}
 * @public
 */
function toBuffer(data) {
  toBuffer.readOnly = true;

  if (Buffer.isBuffer(data)) return data;

  let buf;

  if (data instanceof ArrayBuffer) {
    buf = Buffer.from(data);
  } else if (ArrayBuffer.isView(data)) {
    buf = viewToBuffer(data);
  } else {
    buf = Buffer.from(data);
    toBuffer.readOnly = false;
  }

  return buf;
}

/**
 * Converts an `ArrayBuffer` view into a buffer.
 *
 * @param {(DataView|TypedArray)} view The view to convert
 * @return {Buffer} Converted view
 * @private
 */
function viewToBuffer(view) {
  const buf = Buffer.from(view.buffer);

  if (view.byteLength !== view.buffer.byteLength) {
    return buf.slice(view.byteOffset, view.byteOffset + view.byteLength);
  }

  return buf;
}

try {
  const bufferUtil = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module 'bufferutil'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
  const bu = bufferUtil.BufferUtil || bufferUtil;

  module.exports = {
    concat,
    mask(source, mask, output, offset, length) {
      if (length < 48) _mask(source, mask, output, offset, length);
      else bu.mask(source, mask, output, offset, length);
    },
    toArrayBuffer,
    toBuffer,
    unmask(buffer, mask) {
      if (buffer.length < 32) _unmask(buffer, mask);
      else bu.unmask(buffer, mask);
    }
  };
} catch (e) /* istanbul ignore next */ {
  module.exports = {
    concat,
    mask: _mask,
    toArrayBuffer,
    toBuffer,
    unmask: _unmask
  };
}


/***/ }),

/***/ "./node_modules/ws/lib/constants.js":
/*!******************************************!*\
  !*** ./node_modules/ws/lib/constants.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  BINARY_TYPES: ['nodebuffer', 'arraybuffer', 'fragments'],
  GUID: '258EAFA5-E914-47DA-95CA-C5AB0DC85B11',
  kStatusCode: Symbol('status-code'),
  kWebSocket: Symbol('websocket'),
  EMPTY_BUFFER: Buffer.alloc(0),
  NOOP: () => {}
};


/***/ }),

/***/ "./node_modules/ws/lib/event-target.js":
/*!*********************************************!*\
  !*** ./node_modules/ws/lib/event-target.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Class representing an event.
 *
 * @private
 */
class Event {
  /**
   * Create a new `Event`.
   *
   * @param {String} type The name of the event
   * @param {Object} target A reference to the target to which the event was dispatched
   */
  constructor(type, target) {
    this.target = target;
    this.type = type;
  }
}

/**
 * Class representing a message event.
 *
 * @extends Event
 * @private
 */
class MessageEvent extends Event {
  /**
   * Create a new `MessageEvent`.
   *
   * @param {(String|Buffer|ArrayBuffer|Buffer[])} data The received data
   * @param {WebSocket} target A reference to the target to which the event was dispatched
   */
  constructor(data, target) {
    super('message', target);

    this.data = data;
  }
}

/**
 * Class representing a close event.
 *
 * @extends Event
 * @private
 */
class CloseEvent extends Event {
  /**
   * Create a new `CloseEvent`.
   *
   * @param {Number} code The status code explaining why the connection is being closed
   * @param {String} reason A human-readable string explaining why the connection is closing
   * @param {WebSocket} target A reference to the target to which the event was dispatched
   */
  constructor(code, reason, target) {
    super('close', target);

    this.wasClean = target._closeFrameReceived && target._closeFrameSent;
    this.reason = reason;
    this.code = code;
  }
}

/**
 * Class representing an open event.
 *
 * @extends Event
 * @private
 */
class OpenEvent extends Event {
  /**
   * Create a new `OpenEvent`.
   *
   * @param {WebSocket} target A reference to the target to which the event was dispatched
   */
  constructor(target) {
    super('open', target);
  }
}

/**
 * Class representing an error event.
 *
 * @extends Event
 * @private
 */
class ErrorEvent extends Event {
  /**
   * Create a new `ErrorEvent`.
   *
   * @param {Object} error The error that generated this event
   * @param {WebSocket} target A reference to the target to which the event was dispatched
   */
  constructor(error, target) {
    super('error', target);

    this.message = error.message;
    this.error = error;
  }
}

/**
 * This provides methods for emulating the `EventTarget` interface. It's not
 * meant to be used directly.
 *
 * @mixin
 */
const EventTarget = {
  /**
   * Register an event listener.
   *
   * @param {String} method A string representing the event type to listen for
   * @param {Function} listener The listener to add
   * @public
   */
  addEventListener(method, listener) {
    if (typeof listener !== 'function') return;

    function onMessage(data) {
      listener.call(this, new MessageEvent(data, this));
    }

    function onClose(code, message) {
      listener.call(this, new CloseEvent(code, message, this));
    }

    function onError(error) {
      listener.call(this, new ErrorEvent(error, this));
    }

    function onOpen() {
      listener.call(this, new OpenEvent(this));
    }

    if (method === 'message') {
      onMessage._listener = listener;
      this.on(method, onMessage);
    } else if (method === 'close') {
      onClose._listener = listener;
      this.on(method, onClose);
    } else if (method === 'error') {
      onError._listener = listener;
      this.on(method, onError);
    } else if (method === 'open') {
      onOpen._listener = listener;
      this.on(method, onOpen);
    } else {
      this.on(method, listener);
    }
  },

  /**
   * Remove an event listener.
   *
   * @param {String} method A string representing the event type to remove
   * @param {Function} listener The listener to remove
   * @public
   */
  removeEventListener(method, listener) {
    const listeners = this.listeners(method);

    for (let i = 0; i < listeners.length; i++) {
      if (listeners[i] === listener || listeners[i]._listener === listener) {
        this.removeListener(method, listeners[i]);
      }
    }
  }
};

module.exports = EventTarget;


/***/ }),

/***/ "./node_modules/ws/lib/extension.js":
/*!******************************************!*\
  !*** ./node_modules/ws/lib/extension.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//
// Allowed token characters:
//
// '!', '#', '$', '%', '&', ''', '*', '+', '-',
// '.', 0-9, A-Z, '^', '_', '`', a-z, '|', '~'
//
// tokenChars[32] === 0 // ' '
// tokenChars[33] === 1 // '!'
// tokenChars[34] === 0 // '"'
// ...
//
// prettier-ignore
const tokenChars = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0 - 15
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
  0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, // 32 - 47
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 48 - 63
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, // 80 - 95
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0 // 112 - 127
];

/**
 * Adds an offer to the map of extension offers or a parameter to the map of
 * parameters.
 *
 * @param {Object} dest The map of extension offers or parameters
 * @param {String} name The extension or parameter name
 * @param {(Object|Boolean|String)} elem The extension parameters or the
 *     parameter value
 * @private
 */
function push(dest, name, elem) {
  if (dest[name] === undefined) dest[name] = [elem];
  else dest[name].push(elem);
}

/**
 * Parses the `Sec-WebSocket-Extensions` header into an object.
 *
 * @param {String} header The field value of the header
 * @return {Object} The parsed object
 * @public
 */
function parse(header) {
  const offers = Object.create(null);

  if (header === undefined || header === '') return offers;

  let params = Object.create(null);
  let mustUnescape = false;
  let isEscaping = false;
  let inQuotes = false;
  let extensionName;
  let paramName;
  let start = -1;
  let end = -1;
  let i = 0;

  for (; i < header.length; i++) {
    const code = header.charCodeAt(i);

    if (extensionName === undefined) {
      if (end === -1 && tokenChars[code] === 1) {
        if (start === -1) start = i;
      } else if (code === 0x20 /* ' ' */ || code === 0x09 /* '\t' */) {
        if (end === -1 && start !== -1) end = i;
      } else if (code === 0x3b /* ';' */ || code === 0x2c /* ',' */) {
        if (start === -1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }

        if (end === -1) end = i;
        const name = header.slice(start, end);
        if (code === 0x2c) {
          push(offers, name, params);
          params = Object.create(null);
        } else {
          extensionName = name;
        }

        start = end = -1;
      } else {
        throw new SyntaxError(`Unexpected character at index ${i}`);
      }
    } else if (paramName === undefined) {
      if (end === -1 && tokenChars[code] === 1) {
        if (start === -1) start = i;
      } else if (code === 0x20 || code === 0x09) {
        if (end === -1 && start !== -1) end = i;
      } else if (code === 0x3b || code === 0x2c) {
        if (start === -1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }

        if (end === -1) end = i;
        push(params, header.slice(start, end), true);
        if (code === 0x2c) {
          push(offers, extensionName, params);
          params = Object.create(null);
          extensionName = undefined;
        }

        start = end = -1;
      } else if (code === 0x3d /* '=' */ && start !== -1 && end === -1) {
        paramName = header.slice(start, i);
        start = end = -1;
      } else {
        throw new SyntaxError(`Unexpected character at index ${i}`);
      }
    } else {
      //
      // The value of a quoted-string after unescaping must conform to the
      // token ABNF, so only token characters are valid.
      // Ref: https://tools.ietf.org/html/rfc6455#section-9.1
      //
      if (isEscaping) {
        if (tokenChars[code] !== 1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
        if (start === -1) start = i;
        else if (!mustUnescape) mustUnescape = true;
        isEscaping = false;
      } else if (inQuotes) {
        if (tokenChars[code] === 1) {
          if (start === -1) start = i;
        } else if (code === 0x22 /* '"' */ && start !== -1) {
          inQuotes = false;
          end = i;
        } else if (code === 0x5c /* '\' */) {
          isEscaping = true;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      } else if (code === 0x22 && header.charCodeAt(i - 1) === 0x3d) {
        inQuotes = true;
      } else if (end === -1 && tokenChars[code] === 1) {
        if (start === -1) start = i;
      } else if (start !== -1 && (code === 0x20 || code === 0x09)) {
        if (end === -1) end = i;
      } else if (code === 0x3b || code === 0x2c) {
        if (start === -1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }

        if (end === -1) end = i;
        let value = header.slice(start, end);
        if (mustUnescape) {
          value = value.replace(/\\/g, '');
          mustUnescape = false;
        }
        push(params, paramName, value);
        if (code === 0x2c) {
          push(offers, extensionName, params);
          params = Object.create(null);
          extensionName = undefined;
        }

        paramName = undefined;
        start = end = -1;
      } else {
        throw new SyntaxError(`Unexpected character at index ${i}`);
      }
    }
  }

  if (start === -1 || inQuotes) {
    throw new SyntaxError('Unexpected end of input');
  }

  if (end === -1) end = i;
  const token = header.slice(start, end);
  if (extensionName === undefined) {
    push(offers, token, params);
  } else {
    if (paramName === undefined) {
      push(params, token, true);
    } else if (mustUnescape) {
      push(params, paramName, token.replace(/\\/g, ''));
    } else {
      push(params, paramName, token);
    }
    push(offers, extensionName, params);
  }

  return offers;
}

/**
 * Builds the `Sec-WebSocket-Extensions` header field value.
 *
 * @param {Object} extensions The map of extensions and parameters to format
 * @return {String} A string representing the given object
 * @public
 */
function format(extensions) {
  return Object.keys(extensions)
    .map((extension) => {
      let configurations = extensions[extension];
      if (!Array.isArray(configurations)) configurations = [configurations];
      return configurations
        .map((params) => {
          return [extension]
            .concat(
              Object.keys(params).map((k) => {
                let values = params[k];
                if (!Array.isArray(values)) values = [values];
                return values
                  .map((v) => (v === true ? k : `${k}=${v}`))
                  .join('; ');
              })
            )
            .join('; ');
        })
        .join(', ');
    })
    .join(', ');
}

module.exports = { format, parse };


/***/ }),

/***/ "./node_modules/ws/lib/limiter.js":
/*!****************************************!*\
  !*** ./node_modules/ws/lib/limiter.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const kDone = Symbol('kDone');
const kRun = Symbol('kRun');

/**
 * A very simple job queue with adjustable concurrency. Adapted from
 * https://github.com/STRML/async-limiter
 */
class Limiter {
  /**
   * Creates a new `Limiter`.
   *
   * @param {Number} concurrency The maximum number of jobs allowed to run
   *     concurrently
   */
  constructor(concurrency) {
    this[kDone] = () => {
      this.pending--;
      this[kRun]();
    };
    this.concurrency = concurrency || Infinity;
    this.jobs = [];
    this.pending = 0;
  }

  /**
   * Adds a job to the queue.
   *
   * @public
   */
  add(job) {
    this.jobs.push(job);
    this[kRun]();
  }

  /**
   * Removes a job from the queue and runs it if possible.
   *
   * @private
   */
  [kRun]() {
    if (this.pending === this.concurrency) return;

    if (this.jobs.length) {
      const job = this.jobs.shift();

      this.pending++;
      job(this[kDone]);
    }
  }
}

module.exports = Limiter;


/***/ }),

/***/ "./node_modules/ws/lib/permessage-deflate.js":
/*!***************************************************!*\
  !*** ./node_modules/ws/lib/permessage-deflate.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const zlib = __webpack_require__(/*! zlib */ "zlib");

const bufferUtil = __webpack_require__(/*! ./buffer-util */ "./node_modules/ws/lib/buffer-util.js");
const Limiter = __webpack_require__(/*! ./limiter */ "./node_modules/ws/lib/limiter.js");
const { kStatusCode, NOOP } = __webpack_require__(/*! ./constants */ "./node_modules/ws/lib/constants.js");

const TRAILER = Buffer.from([0x00, 0x00, 0xff, 0xff]);
const kPerMessageDeflate = Symbol('permessage-deflate');
const kTotalLength = Symbol('total-length');
const kCallback = Symbol('callback');
const kBuffers = Symbol('buffers');
const kError = Symbol('error');

//
// We limit zlib concurrency, which prevents severe memory fragmentation
// as documented in https://github.com/nodejs/node/issues/8871#issuecomment-250915913
// and https://github.com/websockets/ws/issues/1202
//
// Intentionally global; it's the global thread pool that's an issue.
//
let zlibLimiter;

/**
 * permessage-deflate implementation.
 */
class PerMessageDeflate {
  /**
   * Creates a PerMessageDeflate instance.
   *
   * @param {Object} options Configuration options
   * @param {Boolean} options.serverNoContextTakeover Request/accept disabling
   *     of server context takeover
   * @param {Boolean} options.clientNoContextTakeover Advertise/acknowledge
   *     disabling of client context takeover
   * @param {(Boolean|Number)} options.serverMaxWindowBits Request/confirm the
   *     use of a custom server window size
   * @param {(Boolean|Number)} options.clientMaxWindowBits Advertise support
   *     for, or request, a custom client window size
   * @param {Object} options.zlibDeflateOptions Options to pass to zlib on deflate
   * @param {Object} options.zlibInflateOptions Options to pass to zlib on inflate
   * @param {Number} options.threshold Size (in bytes) below which messages
   *     should not be compressed
   * @param {Number} options.concurrencyLimit The number of concurrent calls to
   *     zlib
   * @param {Boolean} isServer Create the instance in either server or client
   *     mode
   * @param {Number} maxPayload The maximum allowed message length
   */
  constructor(options, isServer, maxPayload) {
    this._maxPayload = maxPayload | 0;
    this._options = options || {};
    this._threshold =
      this._options.threshold !== undefined ? this._options.threshold : 1024;
    this._isServer = !!isServer;
    this._deflate = null;
    this._inflate = null;

    this.params = null;

    if (!zlibLimiter) {
      const concurrency =
        this._options.concurrencyLimit !== undefined
          ? this._options.concurrencyLimit
          : 10;
      zlibLimiter = new Limiter(concurrency);
    }
  }

  /**
   * @type {String}
   */
  static get extensionName() {
    return 'permessage-deflate';
  }

  /**
   * Create an extension negotiation offer.
   *
   * @return {Object} Extension parameters
   * @public
   */
  offer() {
    const params = {};

    if (this._options.serverNoContextTakeover) {
      params.server_no_context_takeover = true;
    }
    if (this._options.clientNoContextTakeover) {
      params.client_no_context_takeover = true;
    }
    if (this._options.serverMaxWindowBits) {
      params.server_max_window_bits = this._options.serverMaxWindowBits;
    }
    if (this._options.clientMaxWindowBits) {
      params.client_max_window_bits = this._options.clientMaxWindowBits;
    } else if (this._options.clientMaxWindowBits == null) {
      params.client_max_window_bits = true;
    }

    return params;
  }

  /**
   * Accept an extension negotiation offer/response.
   *
   * @param {Array} configurations The extension negotiation offers/reponse
   * @return {Object} Accepted configuration
   * @public
   */
  accept(configurations) {
    configurations = this.normalizeParams(configurations);

    this.params = this._isServer
      ? this.acceptAsServer(configurations)
      : this.acceptAsClient(configurations);

    return this.params;
  }

  /**
   * Releases all resources used by the extension.
   *
   * @public
   */
  cleanup() {
    if (this._inflate) {
      this._inflate.close();
      this._inflate = null;
    }

    if (this._deflate) {
      if (this._deflate[kCallback]) {
        this._deflate[kCallback]();
      }

      this._deflate.close();
      this._deflate = null;
    }
  }

  /**
   *  Accept an extension negotiation offer.
   *
   * @param {Array} offers The extension negotiation offers
   * @return {Object} Accepted configuration
   * @private
   */
  acceptAsServer(offers) {
    const opts = this._options;
    const accepted = offers.find((params) => {
      if (
        (opts.serverNoContextTakeover === false &&
          params.server_no_context_takeover) ||
        (params.server_max_window_bits &&
          (opts.serverMaxWindowBits === false ||
            (typeof opts.serverMaxWindowBits === 'number' &&
              opts.serverMaxWindowBits > params.server_max_window_bits))) ||
        (typeof opts.clientMaxWindowBits === 'number' &&
          !params.client_max_window_bits)
      ) {
        return false;
      }

      return true;
    });

    if (!accepted) {
      throw new Error('None of the extension offers can be accepted');
    }

    if (opts.serverNoContextTakeover) {
      accepted.server_no_context_takeover = true;
    }
    if (opts.clientNoContextTakeover) {
      accepted.client_no_context_takeover = true;
    }
    if (typeof opts.serverMaxWindowBits === 'number') {
      accepted.server_max_window_bits = opts.serverMaxWindowBits;
    }
    if (typeof opts.clientMaxWindowBits === 'number') {
      accepted.client_max_window_bits = opts.clientMaxWindowBits;
    } else if (
      accepted.client_max_window_bits === true ||
      opts.clientMaxWindowBits === false
    ) {
      delete accepted.client_max_window_bits;
    }

    return accepted;
  }

  /**
   * Accept the extension negotiation response.
   *
   * @param {Array} response The extension negotiation response
   * @return {Object} Accepted configuration
   * @private
   */
  acceptAsClient(response) {
    const params = response[0];

    if (
      this._options.clientNoContextTakeover === false &&
      params.client_no_context_takeover
    ) {
      throw new Error('Unexpected parameter "client_no_context_takeover"');
    }

    if (!params.client_max_window_bits) {
      if (typeof this._options.clientMaxWindowBits === 'number') {
        params.client_max_window_bits = this._options.clientMaxWindowBits;
      }
    } else if (
      this._options.clientMaxWindowBits === false ||
      (typeof this._options.clientMaxWindowBits === 'number' &&
        params.client_max_window_bits > this._options.clientMaxWindowBits)
    ) {
      throw new Error(
        'Unexpected or invalid parameter "client_max_window_bits"'
      );
    }

    return params;
  }

  /**
   * Normalize parameters.
   *
   * @param {Array} configurations The extension negotiation offers/reponse
   * @return {Array} The offers/response with normalized parameters
   * @private
   */
  normalizeParams(configurations) {
    configurations.forEach((params) => {
      Object.keys(params).forEach((key) => {
        let value = params[key];

        if (value.length > 1) {
          throw new Error(`Parameter "${key}" must have only a single value`);
        }

        value = value[0];

        if (key === 'client_max_window_bits') {
          if (value !== true) {
            const num = +value;
            if (!Number.isInteger(num) || num < 8 || num > 15) {
              throw new TypeError(
                `Invalid value for parameter "${key}": ${value}`
              );
            }
            value = num;
          } else if (!this._isServer) {
            throw new TypeError(
              `Invalid value for parameter "${key}": ${value}`
            );
          }
        } else if (key === 'server_max_window_bits') {
          const num = +value;
          if (!Number.isInteger(num) || num < 8 || num > 15) {
            throw new TypeError(
              `Invalid value for parameter "${key}": ${value}`
            );
          }
          value = num;
        } else if (
          key === 'client_no_context_takeover' ||
          key === 'server_no_context_takeover'
        ) {
          if (value !== true) {
            throw new TypeError(
              `Invalid value for parameter "${key}": ${value}`
            );
          }
        } else {
          throw new Error(`Unknown parameter "${key}"`);
        }

        params[key] = value;
      });
    });

    return configurations;
  }

  /**
   * Decompress data. Concurrency limited.
   *
   * @param {Buffer} data Compressed data
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @public
   */
  decompress(data, fin, callback) {
    zlibLimiter.add((done) => {
      this._decompress(data, fin, (err, result) => {
        done();
        callback(err, result);
      });
    });
  }

  /**
   * Compress data. Concurrency limited.
   *
   * @param {Buffer} data Data to compress
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @public
   */
  compress(data, fin, callback) {
    zlibLimiter.add((done) => {
      this._compress(data, fin, (err, result) => {
        done();
        if (err || result) {
          callback(err, result);
        }
      });
    });
  }

  /**
   * Decompress data.
   *
   * @param {Buffer} data Compressed data
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @private
   */
  _decompress(data, fin, callback) {
    const endpoint = this._isServer ? 'client' : 'server';

    if (!this._inflate) {
      const key = `${endpoint}_max_window_bits`;
      const windowBits =
        typeof this.params[key] !== 'number'
          ? zlib.Z_DEFAULT_WINDOWBITS
          : this.params[key];

      this._inflate = zlib.createInflateRaw({
        ...this._options.zlibInflateOptions,
        windowBits
      });
      this._inflate[kPerMessageDeflate] = this;
      this._inflate[kTotalLength] = 0;
      this._inflate[kBuffers] = [];
      this._inflate.on('error', inflateOnError);
      this._inflate.on('data', inflateOnData);
    }

    this._inflate[kCallback] = callback;

    this._inflate.write(data);
    if (fin) this._inflate.write(TRAILER);

    this._inflate.flush(() => {
      const err = this._inflate[kError];

      if (err) {
        this._inflate.close();
        this._inflate = null;
        callback(err);
        return;
      }

      const data = bufferUtil.concat(
        this._inflate[kBuffers],
        this._inflate[kTotalLength]
      );

      if (fin && this.params[`${endpoint}_no_context_takeover`]) {
        this._inflate.close();
        this._inflate = null;
      } else {
        this._inflate[kTotalLength] = 0;
        this._inflate[kBuffers] = [];
      }

      callback(null, data);
    });
  }

  /**
   * Compress data.
   *
   * @param {Buffer} data Data to compress
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @private
   */
  _compress(data, fin, callback) {
    const endpoint = this._isServer ? 'server' : 'client';

    if (!this._deflate) {
      const key = `${endpoint}_max_window_bits`;
      const windowBits =
        typeof this.params[key] !== 'number'
          ? zlib.Z_DEFAULT_WINDOWBITS
          : this.params[key];

      this._deflate = zlib.createDeflateRaw({
        ...this._options.zlibDeflateOptions,
        windowBits
      });

      this._deflate[kTotalLength] = 0;
      this._deflate[kBuffers] = [];

      //
      // An `'error'` event is emitted, only on Node.js < 10.0.0, if the
      // `zlib.DeflateRaw` instance is closed while data is being processed.
      // This can happen if `PerMessageDeflate#cleanup()` is called at the wrong
      // time due to an abnormal WebSocket closure.
      //
      this._deflate.on('error', NOOP);
      this._deflate.on('data', deflateOnData);
    }

    this._deflate[kCallback] = callback;

    this._deflate.write(data);
    this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
      if (!this._deflate) {
        //
        // This `if` statement is only needed for Node.js < 10.0.0 because as of
        // commit https://github.com/nodejs/node/commit/5e3f5164, the flush
        // callback is no longer called if the deflate stream is closed while
        // data is being processed.
        //
        return;
      }

      let data = bufferUtil.concat(
        this._deflate[kBuffers],
        this._deflate[kTotalLength]
      );

      if (fin) data = data.slice(0, data.length - 4);

      //
      // Ensure that the callback will not be called again in
      // `PerMessageDeflate#cleanup()`.
      //
      this._deflate[kCallback] = null;

      if (fin && this.params[`${endpoint}_no_context_takeover`]) {
        this._deflate.close();
        this._deflate = null;
      } else {
        this._deflate[kTotalLength] = 0;
        this._deflate[kBuffers] = [];
      }

      callback(null, data);
    });
  }
}

module.exports = PerMessageDeflate;

/**
 * The listener of the `zlib.DeflateRaw` stream `'data'` event.
 *
 * @param {Buffer} chunk A chunk of data
 * @private
 */
function deflateOnData(chunk) {
  this[kBuffers].push(chunk);
  this[kTotalLength] += chunk.length;
}

/**
 * The listener of the `zlib.InflateRaw` stream `'data'` event.
 *
 * @param {Buffer} chunk A chunk of data
 * @private
 */
function inflateOnData(chunk) {
  this[kTotalLength] += chunk.length;

  if (
    this[kPerMessageDeflate]._maxPayload < 1 ||
    this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload
  ) {
    this[kBuffers].push(chunk);
    return;
  }

  this[kError] = new RangeError('Max payload size exceeded');
  this[kError][kStatusCode] = 1009;
  this.removeListener('data', inflateOnData);
  this.reset();
}

/**
 * The listener of the `zlib.InflateRaw` stream `'error'` event.
 *
 * @param {Error} err The emitted error
 * @private
 */
function inflateOnError(err) {
  //
  // There is no need to call `Zlib#close()` as the handle is automatically
  // closed when an error is emitted.
  //
  this[kPerMessageDeflate]._inflate = null;
  err[kStatusCode] = 1007;
  this[kCallback](err);
}


/***/ }),

/***/ "./node_modules/ws/lib/receiver.js":
/*!*****************************************!*\
  !*** ./node_modules/ws/lib/receiver.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const { Writable } = __webpack_require__(/*! stream */ "stream");

const PerMessageDeflate = __webpack_require__(/*! ./permessage-deflate */ "./node_modules/ws/lib/permessage-deflate.js");
const {
  BINARY_TYPES,
  EMPTY_BUFFER,
  kStatusCode,
  kWebSocket
} = __webpack_require__(/*! ./constants */ "./node_modules/ws/lib/constants.js");
const { concat, toArrayBuffer, unmask } = __webpack_require__(/*! ./buffer-util */ "./node_modules/ws/lib/buffer-util.js");
const { isValidStatusCode, isValidUTF8 } = __webpack_require__(/*! ./validation */ "./node_modules/ws/lib/validation.js");

const GET_INFO = 0;
const GET_PAYLOAD_LENGTH_16 = 1;
const GET_PAYLOAD_LENGTH_64 = 2;
const GET_MASK = 3;
const GET_DATA = 4;
const INFLATING = 5;

/**
 * HyBi Receiver implementation.
 *
 * @extends stream.Writable
 */
class Receiver extends Writable {
  /**
   * Creates a Receiver instance.
   *
   * @param {String} binaryType The type for binary data
   * @param {Object} extensions An object containing the negotiated extensions
   * @param {Number} maxPayload The maximum allowed message length
   */
  constructor(binaryType, extensions, maxPayload) {
    super();

    this._binaryType = binaryType || BINARY_TYPES[0];
    this[kWebSocket] = undefined;
    this._extensions = extensions || {};
    this._maxPayload = maxPayload | 0;

    this._bufferedBytes = 0;
    this._buffers = [];

    this._compressed = false;
    this._payloadLength = 0;
    this._mask = undefined;
    this._fragmented = 0;
    this._masked = false;
    this._fin = false;
    this._opcode = 0;

    this._totalPayloadLength = 0;
    this._messageLength = 0;
    this._fragments = [];

    this._state = GET_INFO;
    this._loop = false;
  }

  /**
   * Implements `Writable.prototype._write()`.
   *
   * @param {Buffer} chunk The chunk of data to write
   * @param {String} encoding The character encoding of `chunk`
   * @param {Function} cb Callback
   */
  _write(chunk, encoding, cb) {
    if (this._opcode === 0x08 && this._state == GET_INFO) return cb();

    this._bufferedBytes += chunk.length;
    this._buffers.push(chunk);
    this.startLoop(cb);
  }

  /**
   * Consumes `n` bytes from the buffered data.
   *
   * @param {Number} n The number of bytes to consume
   * @return {Buffer} The consumed bytes
   * @private
   */
  consume(n) {
    this._bufferedBytes -= n;

    if (n === this._buffers[0].length) return this._buffers.shift();

    if (n < this._buffers[0].length) {
      const buf = this._buffers[0];
      this._buffers[0] = buf.slice(n);
      return buf.slice(0, n);
    }

    const dst = Buffer.allocUnsafe(n);

    do {
      const buf = this._buffers[0];
      const offset = dst.length - n;

      if (n >= buf.length) {
        dst.set(this._buffers.shift(), offset);
      } else {
        dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
        this._buffers[0] = buf.slice(n);
      }

      n -= buf.length;
    } while (n > 0);

    return dst;
  }

  /**
   * Starts the parsing loop.
   *
   * @param {Function} cb Callback
   * @private
   */
  startLoop(cb) {
    let err;
    this._loop = true;

    do {
      switch (this._state) {
        case GET_INFO:
          err = this.getInfo();
          break;
        case GET_PAYLOAD_LENGTH_16:
          err = this.getPayloadLength16();
          break;
        case GET_PAYLOAD_LENGTH_64:
          err = this.getPayloadLength64();
          break;
        case GET_MASK:
          this.getMask();
          break;
        case GET_DATA:
          err = this.getData(cb);
          break;
        default:
          // `INFLATING`
          this._loop = false;
          return;
      }
    } while (this._loop);

    cb(err);
  }

  /**
   * Reads the first two bytes of a frame.
   *
   * @return {(RangeError|undefined)} A possible error
   * @private
   */
  getInfo() {
    if (this._bufferedBytes < 2) {
      this._loop = false;
      return;
    }

    const buf = this.consume(2);

    if ((buf[0] & 0x30) !== 0x00) {
      this._loop = false;
      return error(RangeError, 'RSV2 and RSV3 must be clear', true, 1002);
    }

    const compressed = (buf[0] & 0x40) === 0x40;

    if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
      this._loop = false;
      return error(RangeError, 'RSV1 must be clear', true, 1002);
    }

    this._fin = (buf[0] & 0x80) === 0x80;
    this._opcode = buf[0] & 0x0f;
    this._payloadLength = buf[1] & 0x7f;

    if (this._opcode === 0x00) {
      if (compressed) {
        this._loop = false;
        return error(RangeError, 'RSV1 must be clear', true, 1002);
      }

      if (!this._fragmented) {
        this._loop = false;
        return error(RangeError, 'invalid opcode 0', true, 1002);
      }

      this._opcode = this._fragmented;
    } else if (this._opcode === 0x01 || this._opcode === 0x02) {
      if (this._fragmented) {
        this._loop = false;
        return error(RangeError, `invalid opcode ${this._opcode}`, true, 1002);
      }

      this._compressed = compressed;
    } else if (this._opcode > 0x07 && this._opcode < 0x0b) {
      if (!this._fin) {
        this._loop = false;
        return error(RangeError, 'FIN must be set', true, 1002);
      }

      if (compressed) {
        this._loop = false;
        return error(RangeError, 'RSV1 must be clear', true, 1002);
      }

      if (this._payloadLength > 0x7d) {
        this._loop = false;
        return error(
          RangeError,
          `invalid payload length ${this._payloadLength}`,
          true,
          1002
        );
      }
    } else {
      this._loop = false;
      return error(RangeError, `invalid opcode ${this._opcode}`, true, 1002);
    }

    if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
    this._masked = (buf[1] & 0x80) === 0x80;

    if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
    else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
    else return this.haveLength();
  }

  /**
   * Gets extended payload length (7+16).
   *
   * @return {(RangeError|undefined)} A possible error
   * @private
   */
  getPayloadLength16() {
    if (this._bufferedBytes < 2) {
      this._loop = false;
      return;
    }

    this._payloadLength = this.consume(2).readUInt16BE(0);
    return this.haveLength();
  }

  /**
   * Gets extended payload length (7+64).
   *
   * @return {(RangeError|undefined)} A possible error
   * @private
   */
  getPayloadLength64() {
    if (this._bufferedBytes < 8) {
      this._loop = false;
      return;
    }

    const buf = this.consume(8);
    const num = buf.readUInt32BE(0);

    //
    // The maximum safe integer in JavaScript is 2^53 - 1. An error is returned
    // if payload length is greater than this number.
    //
    if (num > Math.pow(2, 53 - 32) - 1) {
      this._loop = false;
      return error(
        RangeError,
        'Unsupported WebSocket frame: payload length > 2^53 - 1',
        false,
        1009
      );
    }

    this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
    return this.haveLength();
  }

  /**
   * Payload length has been read.
   *
   * @return {(RangeError|undefined)} A possible error
   * @private
   */
  haveLength() {
    if (this._payloadLength && this._opcode < 0x08) {
      this._totalPayloadLength += this._payloadLength;
      if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
        this._loop = false;
        return error(RangeError, 'Max payload size exceeded', false, 1009);
      }
    }

    if (this._masked) this._state = GET_MASK;
    else this._state = GET_DATA;
  }

  /**
   * Reads mask bytes.
   *
   * @private
   */
  getMask() {
    if (this._bufferedBytes < 4) {
      this._loop = false;
      return;
    }

    this._mask = this.consume(4);
    this._state = GET_DATA;
  }

  /**
   * Reads data bytes.
   *
   * @param {Function} cb Callback
   * @return {(Error|RangeError|undefined)} A possible error
   * @private
   */
  getData(cb) {
    let data = EMPTY_BUFFER;

    if (this._payloadLength) {
      if (this._bufferedBytes < this._payloadLength) {
        this._loop = false;
        return;
      }

      data = this.consume(this._payloadLength);
      if (this._masked) unmask(data, this._mask);
    }

    if (this._opcode > 0x07) return this.controlMessage(data);

    if (this._compressed) {
      this._state = INFLATING;
      this.decompress(data, cb);
      return;
    }

    if (data.length) {
      //
      // This message is not compressed so its lenght is the sum of the payload
      // length of all fragments.
      //
      this._messageLength = this._totalPayloadLength;
      this._fragments.push(data);
    }

    return this.dataMessage();
  }

  /**
   * Decompresses data.
   *
   * @param {Buffer} data Compressed data
   * @param {Function} cb Callback
   * @private
   */
  decompress(data, cb) {
    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

    perMessageDeflate.decompress(data, this._fin, (err, buf) => {
      if (err) return cb(err);

      if (buf.length) {
        this._messageLength += buf.length;
        if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
          return cb(
            error(RangeError, 'Max payload size exceeded', false, 1009)
          );
        }

        this._fragments.push(buf);
      }

      const er = this.dataMessage();
      if (er) return cb(er);

      this.startLoop(cb);
    });
  }

  /**
   * Handles a data message.
   *
   * @return {(Error|undefined)} A possible error
   * @private
   */
  dataMessage() {
    if (this._fin) {
      const messageLength = this._messageLength;
      const fragments = this._fragments;

      this._totalPayloadLength = 0;
      this._messageLength = 0;
      this._fragmented = 0;
      this._fragments = [];

      if (this._opcode === 2) {
        let data;

        if (this._binaryType === 'nodebuffer') {
          data = concat(fragments, messageLength);
        } else if (this._binaryType === 'arraybuffer') {
          data = toArrayBuffer(concat(fragments, messageLength));
        } else {
          data = fragments;
        }

        this.emit('message', data);
      } else {
        const buf = concat(fragments, messageLength);

        if (!isValidUTF8(buf)) {
          this._loop = false;
          return error(Error, 'invalid UTF-8 sequence', true, 1007);
        }

        this.emit('message', buf.toString());
      }
    }

    this._state = GET_INFO;
  }

  /**
   * Handles a control message.
   *
   * @param {Buffer} data Data to handle
   * @return {(Error|RangeError|undefined)} A possible error
   * @private
   */
  controlMessage(data) {
    if (this._opcode === 0x08) {
      this._loop = false;

      if (data.length === 0) {
        this.emit('conclude', 1005, '');
        this.end();
      } else if (data.length === 1) {
        return error(RangeError, 'invalid payload length 1', true, 1002);
      } else {
        const code = data.readUInt16BE(0);

        if (!isValidStatusCode(code)) {
          return error(RangeError, `invalid status code ${code}`, true, 1002);
        }

        const buf = data.slice(2);

        if (!isValidUTF8(buf)) {
          return error(Error, 'invalid UTF-8 sequence', true, 1007);
        }

        this.emit('conclude', code, buf.toString());
        this.end();
      }
    } else if (this._opcode === 0x09) {
      this.emit('ping', data);
    } else {
      this.emit('pong', data);
    }

    this._state = GET_INFO;
  }
}

module.exports = Receiver;

/**
 * Builds an error object.
 *
 * @param {(Error|RangeError)} ErrorCtor The error constructor
 * @param {String} message The error message
 * @param {Boolean} prefix Specifies whether or not to add a default prefix to
 *     `message`
 * @param {Number} statusCode The status code
 * @return {(Error|RangeError)} The error
 * @private
 */
function error(ErrorCtor, message, prefix, statusCode) {
  const err = new ErrorCtor(
    prefix ? `Invalid WebSocket frame: ${message}` : message
  );

  Error.captureStackTrace(err, error);
  err[kStatusCode] = statusCode;
  return err;
}


/***/ }),

/***/ "./node_modules/ws/lib/sender.js":
/*!***************************************!*\
  !*** ./node_modules/ws/lib/sender.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const { randomFillSync } = __webpack_require__(/*! crypto */ "crypto");

const PerMessageDeflate = __webpack_require__(/*! ./permessage-deflate */ "./node_modules/ws/lib/permessage-deflate.js");
const { EMPTY_BUFFER } = __webpack_require__(/*! ./constants */ "./node_modules/ws/lib/constants.js");
const { isValidStatusCode } = __webpack_require__(/*! ./validation */ "./node_modules/ws/lib/validation.js");
const { mask: applyMask, toBuffer } = __webpack_require__(/*! ./buffer-util */ "./node_modules/ws/lib/buffer-util.js");

const mask = Buffer.alloc(4);

/**
 * HyBi Sender implementation.
 */
class Sender {
  /**
   * Creates a Sender instance.
   *
   * @param {net.Socket} socket The connection socket
   * @param {Object} extensions An object containing the negotiated extensions
   */
  constructor(socket, extensions) {
    this._extensions = extensions || {};
    this._socket = socket;

    this._firstFragment = true;
    this._compress = false;

    this._bufferedBytes = 0;
    this._deflating = false;
    this._queue = [];
  }

  /**
   * Frames a piece of data according to the HyBi WebSocket protocol.
   *
   * @param {Buffer} data The data to frame
   * @param {Object} options Options object
   * @param {Number} options.opcode The opcode
   * @param {Boolean} options.readOnly Specifies whether `data` can be modified
   * @param {Boolean} options.fin Specifies whether or not to set the FIN bit
   * @param {Boolean} options.mask Specifies whether or not to mask `data`
   * @param {Boolean} options.rsv1 Specifies whether or not to set the RSV1 bit
   * @return {Buffer[]} The framed data as a list of `Buffer` instances
   * @public
   */
  static frame(data, options) {
    const merge = options.mask && options.readOnly;
    let offset = options.mask ? 6 : 2;
    let payloadLength = data.length;

    if (data.length >= 65536) {
      offset += 8;
      payloadLength = 127;
    } else if (data.length > 125) {
      offset += 2;
      payloadLength = 126;
    }

    const target = Buffer.allocUnsafe(merge ? data.length + offset : offset);

    target[0] = options.fin ? options.opcode | 0x80 : options.opcode;
    if (options.rsv1) target[0] |= 0x40;

    target[1] = payloadLength;

    if (payloadLength === 126) {
      target.writeUInt16BE(data.length, 2);
    } else if (payloadLength === 127) {
      target.writeUInt32BE(0, 2);
      target.writeUInt32BE(data.length, 6);
    }

    if (!options.mask) return [target, data];

    randomFillSync(mask, 0, 4);

    target[1] |= 0x80;
    target[offset - 4] = mask[0];
    target[offset - 3] = mask[1];
    target[offset - 2] = mask[2];
    target[offset - 1] = mask[3];

    if (merge) {
      applyMask(data, mask, target, offset, data.length);
      return [target];
    }

    applyMask(data, mask, data, 0, data.length);
    return [target, data];
  }

  /**
   * Sends a close message to the other peer.
   *
   * @param {(Number|undefined)} code The status code component of the body
   * @param {String} data The message component of the body
   * @param {Boolean} mask Specifies whether or not to mask the message
   * @param {Function} cb Callback
   * @public
   */
  close(code, data, mask, cb) {
    let buf;

    if (code === undefined) {
      buf = EMPTY_BUFFER;
    } else if (typeof code !== 'number' || !isValidStatusCode(code)) {
      throw new TypeError('First argument must be a valid error code number');
    } else if (data === undefined || data === '') {
      buf = Buffer.allocUnsafe(2);
      buf.writeUInt16BE(code, 0);
    } else {
      buf = Buffer.allocUnsafe(2 + Buffer.byteLength(data));
      buf.writeUInt16BE(code, 0);
      buf.write(data, 2);
    }

    if (this._deflating) {
      this.enqueue([this.doClose, buf, mask, cb]);
    } else {
      this.doClose(buf, mask, cb);
    }
  }

  /**
   * Frames and sends a close message.
   *
   * @param {Buffer} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @param {Function} cb Callback
   * @private
   */
  doClose(data, mask, cb) {
    this.sendFrame(
      Sender.frame(data, {
        fin: true,
        rsv1: false,
        opcode: 0x08,
        mask,
        readOnly: false
      }),
      cb
    );
  }

  /**
   * Sends a ping message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @param {Function} cb Callback
   * @public
   */
  ping(data, mask, cb) {
    const buf = toBuffer(data);

    if (this._deflating) {
      this.enqueue([this.doPing, buf, mask, toBuffer.readOnly, cb]);
    } else {
      this.doPing(buf, mask, toBuffer.readOnly, cb);
    }
  }

  /**
   * Frames and sends a ping message.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @param {Boolean} readOnly Specifies whether `data` can be modified
   * @param {Function} cb Callback
   * @private
   */
  doPing(data, mask, readOnly, cb) {
    this.sendFrame(
      Sender.frame(data, {
        fin: true,
        rsv1: false,
        opcode: 0x09,
        mask,
        readOnly
      }),
      cb
    );
  }

  /**
   * Sends a pong message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @param {Function} cb Callback
   * @public
   */
  pong(data, mask, cb) {
    const buf = toBuffer(data);

    if (this._deflating) {
      this.enqueue([this.doPong, buf, mask, toBuffer.readOnly, cb]);
    } else {
      this.doPong(buf, mask, toBuffer.readOnly, cb);
    }
  }

  /**
   * Frames and sends a pong message.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @param {Boolean} readOnly Specifies whether `data` can be modified
   * @param {Function} cb Callback
   * @private
   */
  doPong(data, mask, readOnly, cb) {
    this.sendFrame(
      Sender.frame(data, {
        fin: true,
        rsv1: false,
        opcode: 0x0a,
        mask,
        readOnly
      }),
      cb
    );
  }

  /**
   * Sends a data message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Object} options Options object
   * @param {Boolean} options.compress Specifies whether or not to compress `data`
   * @param {Boolean} options.binary Specifies whether `data` is binary or text
   * @param {Boolean} options.fin Specifies whether the fragment is the last one
   * @param {Boolean} options.mask Specifies whether or not to mask `data`
   * @param {Function} cb Callback
   * @public
   */
  send(data, options, cb) {
    const buf = toBuffer(data);
    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
    let opcode = options.binary ? 2 : 1;
    let rsv1 = options.compress;

    if (this._firstFragment) {
      this._firstFragment = false;
      if (rsv1 && perMessageDeflate) {
        rsv1 = buf.length >= perMessageDeflate._threshold;
      }
      this._compress = rsv1;
    } else {
      rsv1 = false;
      opcode = 0;
    }

    if (options.fin) this._firstFragment = true;

    if (perMessageDeflate) {
      const opts = {
        fin: options.fin,
        rsv1,
        opcode,
        mask: options.mask,
        readOnly: toBuffer.readOnly
      };

      if (this._deflating) {
        this.enqueue([this.dispatch, buf, this._compress, opts, cb]);
      } else {
        this.dispatch(buf, this._compress, opts, cb);
      }
    } else {
      this.sendFrame(
        Sender.frame(buf, {
          fin: options.fin,
          rsv1: false,
          opcode,
          mask: options.mask,
          readOnly: toBuffer.readOnly
        }),
        cb
      );
    }
  }

  /**
   * Dispatches a data message.
   *
   * @param {Buffer} data The message to send
   * @param {Boolean} compress Specifies whether or not to compress `data`
   * @param {Object} options Options object
   * @param {Number} options.opcode The opcode
   * @param {Boolean} options.readOnly Specifies whether `data` can be modified
   * @param {Boolean} options.fin Specifies whether or not to set the FIN bit
   * @param {Boolean} options.mask Specifies whether or not to mask `data`
   * @param {Boolean} options.rsv1 Specifies whether or not to set the RSV1 bit
   * @param {Function} cb Callback
   * @private
   */
  dispatch(data, compress, options, cb) {
    if (!compress) {
      this.sendFrame(Sender.frame(data, options), cb);
      return;
    }

    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

    this._deflating = true;
    perMessageDeflate.compress(data, options.fin, (_, buf) => {
      this._deflating = false;
      options.readOnly = false;
      this.sendFrame(Sender.frame(buf, options), cb);
      this.dequeue();
    });
  }

  /**
   * Executes queued send operations.
   *
   * @private
   */
  dequeue() {
    while (!this._deflating && this._queue.length) {
      const params = this._queue.shift();

      this._bufferedBytes -= params[1].length;
      Reflect.apply(params[0], this, params.slice(1));
    }
  }

  /**
   * Enqueues a send operation.
   *
   * @param {Array} params Send operation parameters.
   * @private
   */
  enqueue(params) {
    this._bufferedBytes += params[1].length;
    this._queue.push(params);
  }

  /**
   * Sends a frame.
   *
   * @param {Buffer[]} list The frame to send
   * @param {Function} cb Callback
   * @private
   */
  sendFrame(list, cb) {
    if (list.length === 2) {
      this._socket.cork();
      this._socket.write(list[0]);
      this._socket.write(list[1], cb);
      this._socket.uncork();
    } else {
      this._socket.write(list[0], cb);
    }
  }
}

module.exports = Sender;


/***/ }),

/***/ "./node_modules/ws/lib/stream.js":
/*!***************************************!*\
  !*** ./node_modules/ws/lib/stream.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const { Duplex } = __webpack_require__(/*! stream */ "stream");

/**
 * Emits the `'close'` event on a stream.
 *
 * @param {stream.Duplex} The stream.
 * @private
 */
function emitClose(stream) {
  stream.emit('close');
}

/**
 * The listener of the `'end'` event.
 *
 * @private
 */
function duplexOnEnd() {
  if (!this.destroyed && this._writableState.finished) {
    this.destroy();
  }
}

/**
 * The listener of the `'error'` event.
 *
 * @private
 */
function duplexOnError(err) {
  this.removeListener('error', duplexOnError);
  this.destroy();
  if (this.listenerCount('error') === 0) {
    // Do not suppress the throwing behavior.
    this.emit('error', err);
  }
}

/**
 * Wraps a `WebSocket` in a duplex stream.
 *
 * @param {WebSocket} ws The `WebSocket` to wrap
 * @param {Object} options The options for the `Duplex` constructor
 * @return {stream.Duplex} The duplex stream
 * @public
 */
function createWebSocketStream(ws, options) {
  let resumeOnReceiverDrain = true;

  function receiverOnDrain() {
    if (resumeOnReceiverDrain) ws._socket.resume();
  }

  if (ws.readyState === ws.CONNECTING) {
    ws.once('open', function open() {
      ws._receiver.removeAllListeners('drain');
      ws._receiver.on('drain', receiverOnDrain);
    });
  } else {
    ws._receiver.removeAllListeners('drain');
    ws._receiver.on('drain', receiverOnDrain);
  }

  const duplex = new Duplex({
    ...options,
    autoDestroy: false,
    emitClose: false,
    objectMode: false,
    writableObjectMode: false
  });

  ws.on('message', function message(msg) {
    if (!duplex.push(msg)) {
      resumeOnReceiverDrain = false;
      ws._socket.pause();
    }
  });

  ws.once('error', function error(err) {
    duplex.destroy(err);
  });

  ws.once('close', function close() {
    if (duplex.destroyed) return;

    duplex.push(null);
  });

  duplex._destroy = function(err, callback) {
    if (ws.readyState === ws.CLOSED) {
      callback(err);
      process.nextTick(emitClose, duplex);
      return;
    }

    ws.once('close', function close() {
      callback(err);
      process.nextTick(emitClose, duplex);
    });
    ws.terminate();
  };

  duplex._final = function(callback) {
    if (ws.readyState === ws.CONNECTING) {
      ws.once('open', function open() {
        duplex._final(callback);
      });
      return;
    }

    if (ws._socket._writableState.finished) {
      if (duplex._readableState.endEmitted) duplex.destroy();
      callback();
    } else {
      ws._socket.once('finish', function finish() {
        // `duplex` is not destroyed here because the `'end'` event will be
        // emitted on `duplex` after this `'finish'` event. The EOF signaling
        // `null` chunk is, in fact, pushed when the WebSocket emits `'close'`.
        callback();
      });
      ws.close();
    }
  };

  duplex._read = function() {
    if (ws.readyState === ws.OPEN && !resumeOnReceiverDrain) {
      resumeOnReceiverDrain = true;
      if (!ws._receiver._writableState.needDrain) ws._socket.resume();
    }
  };

  duplex._write = function(chunk, encoding, callback) {
    if (ws.readyState === ws.CONNECTING) {
      ws.once('open', function open() {
        duplex._write(chunk, encoding, callback);
      });
      return;
    }

    ws.send(chunk, callback);
  };

  duplex.on('end', duplexOnEnd);
  duplex.on('error', duplexOnError);
  return duplex;
}

module.exports = createWebSocketStream;


/***/ }),

/***/ "./node_modules/ws/lib/validation.js":
/*!*******************************************!*\
  !*** ./node_modules/ws/lib/validation.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


try {
  const isValidUTF8 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module 'utf-8-validate'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

  exports.isValidUTF8 =
    typeof isValidUTF8 === 'object'
      ? isValidUTF8.Validation.isValidUTF8 // utf-8-validate@<3.0.0
      : isValidUTF8;
} catch (e) /* istanbul ignore next */ {
  exports.isValidUTF8 = () => true;
}

/**
 * Checks if a status code is allowed in a close frame.
 *
 * @param {Number} code The status code
 * @return {Boolean} `true` if the status code is valid, else `false`
 * @public
 */
exports.isValidStatusCode = (code) => {
  return (
    (code >= 1000 &&
      code <= 1013 &&
      code !== 1004 &&
      code !== 1005 &&
      code !== 1006) ||
    (code >= 3000 && code <= 4999)
  );
};


/***/ }),

/***/ "./node_modules/ws/lib/websocket-server.js":
/*!*************************************************!*\
  !*** ./node_modules/ws/lib/websocket-server.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const EventEmitter = __webpack_require__(/*! events */ "events");
const { createHash } = __webpack_require__(/*! crypto */ "crypto");
const { createServer, STATUS_CODES } = __webpack_require__(/*! http */ "http");

const PerMessageDeflate = __webpack_require__(/*! ./permessage-deflate */ "./node_modules/ws/lib/permessage-deflate.js");
const WebSocket = __webpack_require__(/*! ./websocket */ "./node_modules/ws/lib/websocket.js");
const { format, parse } = __webpack_require__(/*! ./extension */ "./node_modules/ws/lib/extension.js");
const { GUID } = __webpack_require__(/*! ./constants */ "./node_modules/ws/lib/constants.js");

const keyRegex = /^[+/0-9A-Za-z]{22}==$/;
const kUsedByWebSocketServer = Symbol('kUsedByWebSocketServer');

/**
 * Class representing a WebSocket server.
 *
 * @extends EventEmitter
 */
class WebSocketServer extends EventEmitter {
  /**
   * Create a `WebSocketServer` instance.
   *
   * @param {Object} options Configuration options
   * @param {Number} options.backlog The maximum length of the queue of pending
   *     connections
   * @param {Boolean} options.clientTracking Specifies whether or not to track
   *     clients
   * @param {Function} options.handleProtocols A hook to handle protocols
   * @param {String} options.host The hostname where to bind the server
   * @param {Number} options.maxPayload The maximum allowed message size
   * @param {Boolean} options.noServer Enable no server mode
   * @param {String} options.path Accept only connections matching this path
   * @param {(Boolean|Object)} options.perMessageDeflate Enable/disable
   *     permessage-deflate
   * @param {Number} options.port The port where to bind the server
   * @param {http.Server} options.server A pre-created HTTP/S server to use
   * @param {Function} options.verifyClient A hook to reject connections
   * @param {Function} callback A listener for the `listening` event
   */
  constructor(options, callback) {
    super();

    options = {
      maxPayload: 100 * 1024 * 1024,
      perMessageDeflate: false,
      handleProtocols: null,
      clientTracking: true,
      verifyClient: null,
      noServer: false,
      backlog: null, // use default (511 as implemented in net.js)
      server: null,
      host: null,
      path: null,
      port: null,
      ...options
    };

    if (options.port == null && !options.server && !options.noServer) {
      throw new TypeError(
        'One of the "port", "server", or "noServer" options must be specified'
      );
    }

    if (options.port != null) {
      this._server = createServer((req, res) => {
        const body = STATUS_CODES[426];

        res.writeHead(426, {
          'Content-Length': body.length,
          'Content-Type': 'text/plain'
        });
        res.end(body);
      });
      this._server.listen(
        options.port,
        options.host,
        options.backlog,
        callback
      );
    } else if (options.server) {
      if (options.server[kUsedByWebSocketServer]) {
        throw new Error(
          'The HTTP/S server is already being used by another WebSocket server'
        );
      }

      options.server[kUsedByWebSocketServer] = true;
      this._server = options.server;
    }

    if (this._server) {
      this._removeListeners = addListeners(this._server, {
        listening: this.emit.bind(this, 'listening'),
        error: this.emit.bind(this, 'error'),
        upgrade: (req, socket, head) => {
          this.handleUpgrade(req, socket, head, (ws) => {
            this.emit('connection', ws, req);
          });
        }
      });
    }

    if (options.perMessageDeflate === true) options.perMessageDeflate = {};
    if (options.clientTracking) this.clients = new Set();
    this.options = options;
  }

  /**
   * Returns the bound address, the address family name, and port of the server
   * as reported by the operating system if listening on an IP socket.
   * If the server is listening on a pipe or UNIX domain socket, the name is
   * returned as a string.
   *
   * @return {(Object|String|null)} The address of the server
   * @public
   */
  address() {
    if (this.options.noServer) {
      throw new Error('The server is operating in "noServer" mode');
    }

    if (!this._server) return null;
    return this._server.address();
  }

  /**
   * Close the server.
   *
   * @param {Function} cb Callback
   * @public
   */
  close(cb) {
    if (cb) this.once('close', cb);

    //
    // Terminate all associated clients.
    //
    if (this.clients) {
      for (const client of this.clients) client.terminate();
    }

    const server = this._server;

    if (server) {
      this._removeListeners();
      this._removeListeners = this._server = null;

      //
      // Close the http server if it was internally created.
      //
      if (this.options.port != null) {
        server.close(() => this.emit('close'));
        return;
      }

      delete server[kUsedByWebSocketServer];
    }

    process.nextTick(emitClose, this);
  }

  /**
   * See if a given request should be handled by this server instance.
   *
   * @param {http.IncomingMessage} req Request object to inspect
   * @return {Boolean} `true` if the request is valid, else `false`
   * @public
   */
  shouldHandle(req) {
    if (this.options.path) {
      const index = req.url.indexOf('?');
      const pathname = index !== -1 ? req.url.slice(0, index) : req.url;

      if (pathname !== this.options.path) return false;
    }

    return true;
  }

  /**
   * Handle a HTTP Upgrade request.
   *
   * @param {http.IncomingMessage} req The request object
   * @param {net.Socket} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Function} cb Callback
   * @public
   */
  handleUpgrade(req, socket, head, cb) {
    socket.on('error', socketOnError);

    const key =
      req.headers['sec-websocket-key'] !== undefined
        ? req.headers['sec-websocket-key'].trim()
        : false;
    const version = +req.headers['sec-websocket-version'];
    const extensions = {};

    if (
      req.method !== 'GET' ||
      req.headers.upgrade.toLowerCase() !== 'websocket' ||
      !key ||
      !keyRegex.test(key) ||
      (version !== 8 && version !== 13) ||
      !this.shouldHandle(req)
    ) {
      return abortHandshake(socket, 400);
    }

    if (this.options.perMessageDeflate) {
      const perMessageDeflate = new PerMessageDeflate(
        this.options.perMessageDeflate,
        true,
        this.options.maxPayload
      );

      try {
        const offers = parse(req.headers['sec-websocket-extensions']);

        if (offers[PerMessageDeflate.extensionName]) {
          perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
          extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
        }
      } catch (err) {
        return abortHandshake(socket, 400);
      }
    }

    //
    // Optionally call external client verification handler.
    //
    if (this.options.verifyClient) {
      const info = {
        origin:
          req.headers[`${version === 8 ? 'sec-websocket-origin' : 'origin'}`],
        secure: !!(req.connection.authorized || req.connection.encrypted),
        req
      };

      if (this.options.verifyClient.length === 2) {
        this.options.verifyClient(info, (verified, code, message, headers) => {
          if (!verified) {
            return abortHandshake(socket, code || 401, message, headers);
          }

          this.completeUpgrade(key, extensions, req, socket, head, cb);
        });
        return;
      }

      if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
    }

    this.completeUpgrade(key, extensions, req, socket, head, cb);
  }

  /**
   * Upgrade the connection to WebSocket.
   *
   * @param {String} key The value of the `Sec-WebSocket-Key` header
   * @param {Object} extensions The accepted extensions
   * @param {http.IncomingMessage} req The request object
   * @param {net.Socket} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Function} cb Callback
   * @private
   */
  completeUpgrade(key, extensions, req, socket, head, cb) {
    //
    // Destroy the socket if the client has already sent a FIN packet.
    //
    if (!socket.readable || !socket.writable) return socket.destroy();

    const digest = createHash('sha1')
      .update(key + GUID)
      .digest('base64');

    const headers = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${digest}`
    ];

    const ws = new WebSocket(null);
    let protocol = req.headers['sec-websocket-protocol'];

    if (protocol) {
      protocol = protocol.trim().split(/ *, */);

      //
      // Optionally call external protocol selection handler.
      //
      if (this.options.handleProtocols) {
        protocol = this.options.handleProtocols(protocol, req);
      } else {
        protocol = protocol[0];
      }

      if (protocol) {
        headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
        ws.protocol = protocol;
      }
    }

    if (extensions[PerMessageDeflate.extensionName]) {
      const params = extensions[PerMessageDeflate.extensionName].params;
      const value = format({
        [PerMessageDeflate.extensionName]: [params]
      });
      headers.push(`Sec-WebSocket-Extensions: ${value}`);
      ws._extensions = extensions;
    }

    //
    // Allow external modification/inspection of handshake headers.
    //
    this.emit('headers', headers, req);

    socket.write(headers.concat('\r\n').join('\r\n'));
    socket.removeListener('error', socketOnError);

    ws.setSocket(socket, head, this.options.maxPayload);

    if (this.clients) {
      this.clients.add(ws);
      ws.on('close', () => this.clients.delete(ws));
    }

    cb(ws);
  }
}

module.exports = WebSocketServer;

/**
 * Add event listeners on an `EventEmitter` using a map of <event, listener>
 * pairs.
 *
 * @param {EventEmitter} server The event emitter
 * @param {Object.<String, Function>} map The listeners to add
 * @return {Function} A function that will remove the added listeners when called
 * @private
 */
function addListeners(server, map) {
  for (const event of Object.keys(map)) server.on(event, map[event]);

  return function removeListeners() {
    for (const event of Object.keys(map)) {
      server.removeListener(event, map[event]);
    }
  };
}

/**
 * Emit a `'close'` event on an `EventEmitter`.
 *
 * @param {EventEmitter} server The event emitter
 * @private
 */
function emitClose(server) {
  server.emit('close');
}

/**
 * Handle premature socket errors.
 *
 * @private
 */
function socketOnError() {
  this.destroy();
}

/**
 * Close the connection when preconditions are not fulfilled.
 *
 * @param {net.Socket} socket The socket of the upgrade request
 * @param {Number} code The HTTP response status code
 * @param {String} [message] The HTTP response body
 * @param {Object} [headers] Additional HTTP response headers
 * @private
 */
function abortHandshake(socket, code, message, headers) {
  if (socket.writable) {
    message = message || STATUS_CODES[code];
    headers = {
      Connection: 'close',
      'Content-type': 'text/html',
      'Content-Length': Buffer.byteLength(message),
      ...headers
    };

    socket.write(
      `HTTP/1.1 ${code} ${STATUS_CODES[code]}\r\n` +
        Object.keys(headers)
          .map((h) => `${h}: ${headers[h]}`)
          .join('\r\n') +
        '\r\n\r\n' +
        message
    );
  }

  socket.removeListener('error', socketOnError);
  socket.destroy();
}


/***/ }),

/***/ "./node_modules/ws/lib/websocket.js":
/*!******************************************!*\
  !*** ./node_modules/ws/lib/websocket.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const EventEmitter = __webpack_require__(/*! events */ "events");
const https = __webpack_require__(/*! https */ "https");
const http = __webpack_require__(/*! http */ "http");
const net = __webpack_require__(/*! net */ "net");
const tls = __webpack_require__(/*! tls */ "tls");
const { randomBytes, createHash } = __webpack_require__(/*! crypto */ "crypto");
const { URL } = __webpack_require__(/*! url */ "url");

const PerMessageDeflate = __webpack_require__(/*! ./permessage-deflate */ "./node_modules/ws/lib/permessage-deflate.js");
const Receiver = __webpack_require__(/*! ./receiver */ "./node_modules/ws/lib/receiver.js");
const Sender = __webpack_require__(/*! ./sender */ "./node_modules/ws/lib/sender.js");
const {
  BINARY_TYPES,
  EMPTY_BUFFER,
  GUID,
  kStatusCode,
  kWebSocket,
  NOOP
} = __webpack_require__(/*! ./constants */ "./node_modules/ws/lib/constants.js");
const { addEventListener, removeEventListener } = __webpack_require__(/*! ./event-target */ "./node_modules/ws/lib/event-target.js");
const { format, parse } = __webpack_require__(/*! ./extension */ "./node_modules/ws/lib/extension.js");
const { toBuffer } = __webpack_require__(/*! ./buffer-util */ "./node_modules/ws/lib/buffer-util.js");

const readyStates = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
const protocolVersions = [8, 13];
const closeTimeout = 30 * 1000;

/**
 * Class representing a WebSocket.
 *
 * @extends EventEmitter
 */
class WebSocket extends EventEmitter {
  /**
   * Create a new `WebSocket`.
   *
   * @param {(String|url.URL)} address The URL to which to connect
   * @param {(String|String[])} protocols The subprotocols
   * @param {Object} options Connection options
   */
  constructor(address, protocols, options) {
    super();

    this.readyState = WebSocket.CONNECTING;
    this.protocol = '';

    this._binaryType = BINARY_TYPES[0];
    this._closeFrameReceived = false;
    this._closeFrameSent = false;
    this._closeMessage = '';
    this._closeTimer = null;
    this._closeCode = 1006;
    this._extensions = {};
    this._receiver = null;
    this._sender = null;
    this._socket = null;

    if (address !== null) {
      this._bufferedAmount = 0;
      this._isServer = false;
      this._redirects = 0;

      if (Array.isArray(protocols)) {
        protocols = protocols.join(', ');
      } else if (typeof protocols === 'object' && protocols !== null) {
        options = protocols;
        protocols = undefined;
      }

      initAsClient(this, address, protocols, options);
    } else {
      this._isServer = true;
    }
  }

  get CONNECTING() {
    return WebSocket.CONNECTING;
  }
  get CLOSING() {
    return WebSocket.CLOSING;
  }
  get CLOSED() {
    return WebSocket.CLOSED;
  }
  get OPEN() {
    return WebSocket.OPEN;
  }

  /**
   * This deviates from the WHATWG interface since ws doesn't support the
   * required default "blob" type (instead we define a custom "nodebuffer"
   * type).
   *
   * @type {String}
   */
  get binaryType() {
    return this._binaryType;
  }

  set binaryType(type) {
    if (!BINARY_TYPES.includes(type)) return;

    this._binaryType = type;

    //
    // Allow to change `binaryType` on the fly.
    //
    if (this._receiver) this._receiver._binaryType = type;
  }

  /**
   * @type {Number}
   */
  get bufferedAmount() {
    if (!this._socket) return this._bufferedAmount;

    //
    // `socket.bufferSize` is `undefined` if the socket is closed.
    //
    return (this._socket.bufferSize || 0) + this._sender._bufferedBytes;
  }

  /**
   * @type {String}
   */
  get extensions() {
    return Object.keys(this._extensions).join();
  }

  /**
   * Set up the socket and the internal resources.
   *
   * @param {net.Socket} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Number} maxPayload The maximum allowed message size
   * @private
   */
  setSocket(socket, head, maxPayload) {
    const receiver = new Receiver(
      this._binaryType,
      this._extensions,
      maxPayload
    );

    this._sender = new Sender(socket, this._extensions);
    this._receiver = receiver;
    this._socket = socket;

    receiver[kWebSocket] = this;
    socket[kWebSocket] = this;

    receiver.on('conclude', receiverOnConclude);
    receiver.on('drain', receiverOnDrain);
    receiver.on('error', receiverOnError);
    receiver.on('message', receiverOnMessage);
    receiver.on('ping', receiverOnPing);
    receiver.on('pong', receiverOnPong);

    socket.setTimeout(0);
    socket.setNoDelay();

    if (head.length > 0) socket.unshift(head);

    socket.on('close', socketOnClose);
    socket.on('data', socketOnData);
    socket.on('end', socketOnEnd);
    socket.on('error', socketOnError);

    this.readyState = WebSocket.OPEN;
    this.emit('open');
  }

  /**
   * Emit the `'close'` event.
   *
   * @private
   */
  emitClose() {
    this.readyState = WebSocket.CLOSED;

    if (!this._socket) {
      this.emit('close', this._closeCode, this._closeMessage);
      return;
    }

    if (this._extensions[PerMessageDeflate.extensionName]) {
      this._extensions[PerMessageDeflate.extensionName].cleanup();
    }

    this._receiver.removeAllListeners();
    this.emit('close', this._closeCode, this._closeMessage);
  }

  /**
   * Start a closing handshake.
   *
   *          +----------+   +-----------+   +----------+
   *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
   *    |     +----------+   +-----------+   +----------+     |
   *          +----------+   +-----------+         |
   * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
   *          +----------+   +-----------+   |
   *    |           |                        |   +---+        |
   *                +------------------------+-->|fin| - - - -
   *    |         +---+                      |   +---+
   *     - - - - -|fin|<---------------------+
   *              +---+
   *
   * @param {Number} code Status code explaining why the connection is closing
   * @param {String} data A string explaining why the connection is closing
   * @public
   */
  close(code, data) {
    if (this.readyState === WebSocket.CLOSED) return;
    if (this.readyState === WebSocket.CONNECTING) {
      const msg = 'WebSocket was closed before the connection was established';
      return abortHandshake(this, this._req, msg);
    }

    if (this.readyState === WebSocket.CLOSING) {
      if (this._closeFrameSent && this._closeFrameReceived) this._socket.end();
      return;
    }

    this.readyState = WebSocket.CLOSING;
    this._sender.close(code, data, !this._isServer, (err) => {
      //
      // This error is handled by the `'error'` listener on the socket. We only
      // want to know if the close frame has been sent here.
      //
      if (err) return;

      this._closeFrameSent = true;
      if (this._closeFrameReceived) this._socket.end();
    });

    //
    // Specify a timeout for the closing handshake to complete.
    //
    this._closeTimer = setTimeout(
      this._socket.destroy.bind(this._socket),
      closeTimeout
    );
  }

  /**
   * Send a ping.
   *
   * @param {*} data The data to send
   * @param {Boolean} mask Indicates whether or not to mask `data`
   * @param {Function} cb Callback which is executed when the ping is sent
   * @public
   */
  ping(data, mask, cb) {
    if (this.readyState === WebSocket.CONNECTING) {
      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
    }

    if (typeof data === 'function') {
      cb = data;
      data = mask = undefined;
    } else if (typeof mask === 'function') {
      cb = mask;
      mask = undefined;
    }

    if (typeof data === 'number') data = data.toString();

    if (this.readyState !== WebSocket.OPEN) {
      sendAfterClose(this, data, cb);
      return;
    }

    if (mask === undefined) mask = !this._isServer;
    this._sender.ping(data || EMPTY_BUFFER, mask, cb);
  }

  /**
   * Send a pong.
   *
   * @param {*} data The data to send
   * @param {Boolean} mask Indicates whether or not to mask `data`
   * @param {Function} cb Callback which is executed when the pong is sent
   * @public
   */
  pong(data, mask, cb) {
    if (this.readyState === WebSocket.CONNECTING) {
      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
    }

    if (typeof data === 'function') {
      cb = data;
      data = mask = undefined;
    } else if (typeof mask === 'function') {
      cb = mask;
      mask = undefined;
    }

    if (typeof data === 'number') data = data.toString();

    if (this.readyState !== WebSocket.OPEN) {
      sendAfterClose(this, data, cb);
      return;
    }

    if (mask === undefined) mask = !this._isServer;
    this._sender.pong(data || EMPTY_BUFFER, mask, cb);
  }

  /**
   * Send a data message.
   *
   * @param {*} data The message to send
   * @param {Object} options Options object
   * @param {Boolean} options.compress Specifies whether or not to compress
   *     `data`
   * @param {Boolean} options.binary Specifies whether `data` is binary or text
   * @param {Boolean} options.fin Specifies whether the fragment is the last one
   * @param {Boolean} options.mask Specifies whether or not to mask `data`
   * @param {Function} cb Callback which is executed when data is written out
   * @public
   */
  send(data, options, cb) {
    if (this.readyState === WebSocket.CONNECTING) {
      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
    }

    if (typeof options === 'function') {
      cb = options;
      options = {};
    }

    if (typeof data === 'number') data = data.toString();

    if (this.readyState !== WebSocket.OPEN) {
      sendAfterClose(this, data, cb);
      return;
    }

    const opts = {
      binary: typeof data !== 'string',
      mask: !this._isServer,
      compress: true,
      fin: true,
      ...options
    };

    if (!this._extensions[PerMessageDeflate.extensionName]) {
      opts.compress = false;
    }

    this._sender.send(data || EMPTY_BUFFER, opts, cb);
  }

  /**
   * Forcibly close the connection.
   *
   * @public
   */
  terminate() {
    if (this.readyState === WebSocket.CLOSED) return;
    if (this.readyState === WebSocket.CONNECTING) {
      const msg = 'WebSocket was closed before the connection was established';
      return abortHandshake(this, this._req, msg);
    }

    if (this._socket) {
      this.readyState = WebSocket.CLOSING;
      this._socket.destroy();
    }
  }
}

readyStates.forEach((readyState, i) => {
  WebSocket[readyState] = i;
});

//
// Add the `onopen`, `onerror`, `onclose`, and `onmessage` attributes.
// See https://html.spec.whatwg.org/multipage/comms.html#the-websocket-interface
//
['open', 'error', 'close', 'message'].forEach((method) => {
  Object.defineProperty(WebSocket.prototype, `on${method}`, {
    /**
     * Return the listener of the event.
     *
     * @return {(Function|undefined)} The event listener or `undefined`
     * @public
     */
    get() {
      const listeners = this.listeners(method);
      for (let i = 0; i < listeners.length; i++) {
        if (listeners[i]._listener) return listeners[i]._listener;
      }

      return undefined;
    },
    /**
     * Add a listener for the event.
     *
     * @param {Function} listener The listener to add
     * @public
     */
    set(listener) {
      const listeners = this.listeners(method);
      for (let i = 0; i < listeners.length; i++) {
        //
        // Remove only the listeners added via `addEventListener`.
        //
        if (listeners[i]._listener) this.removeListener(method, listeners[i]);
      }
      this.addEventListener(method, listener);
    }
  });
});

WebSocket.prototype.addEventListener = addEventListener;
WebSocket.prototype.removeEventListener = removeEventListener;

module.exports = WebSocket;

/**
 * Initialize a WebSocket client.
 *
 * @param {WebSocket} websocket The client to initialize
 * @param {(String|url.URL)} address The URL to which to connect
 * @param {String} protocols The subprotocols
 * @param {Object} options Connection options
 * @param {(Boolean|Object)} options.perMessageDeflate Enable/disable
 *     permessage-deflate
 * @param {Number} options.handshakeTimeout Timeout in milliseconds for the
 *     handshake request
 * @param {Number} options.protocolVersion Value of the `Sec-WebSocket-Version`
 *     header
 * @param {String} options.origin Value of the `Origin` or
 *     `Sec-WebSocket-Origin` header
 * @param {Number} options.maxPayload The maximum allowed message size
 * @param {Boolean} options.followRedirects Whether or not to follow redirects
 * @param {Number} options.maxRedirects The maximum number of redirects allowed
 * @private
 */
function initAsClient(websocket, address, protocols, options) {
  const opts = {
    protocolVersion: protocolVersions[1],
    maxPayload: 100 * 1024 * 1024,
    perMessageDeflate: true,
    followRedirects: false,
    maxRedirects: 10,
    ...options,
    createConnection: undefined,
    socketPath: undefined,
    hostname: undefined,
    protocol: undefined,
    timeout: undefined,
    method: undefined,
    auth: undefined,
    host: undefined,
    path: undefined,
    port: undefined
  };

  if (!protocolVersions.includes(opts.protocolVersion)) {
    throw new RangeError(
      `Unsupported protocol version: ${opts.protocolVersion} ` +
        `(supported versions: ${protocolVersions.join(', ')})`
    );
  }

  let parsedUrl;

  if (address instanceof URL) {
    parsedUrl = address;
    websocket.url = address.href;
  } else {
    parsedUrl = new URL(address);
    websocket.url = address;
  }

  const isUnixSocket = parsedUrl.protocol === 'ws+unix:';

  if (!parsedUrl.host && (!isUnixSocket || !parsedUrl.pathname)) {
    throw new Error(`Invalid URL: ${websocket.url}`);
  }

  const isSecure =
    parsedUrl.protocol === 'wss:' || parsedUrl.protocol === 'https:';
  const defaultPort = isSecure ? 443 : 80;
  const key = randomBytes(16).toString('base64');
  const get = isSecure ? https.get : http.get;
  let perMessageDeflate;

  opts.createConnection = isSecure ? tlsConnect : netConnect;
  opts.defaultPort = opts.defaultPort || defaultPort;
  opts.port = parsedUrl.port || defaultPort;
  opts.host = parsedUrl.hostname.startsWith('[')
    ? parsedUrl.hostname.slice(1, -1)
    : parsedUrl.hostname;
  opts.headers = {
    'Sec-WebSocket-Version': opts.protocolVersion,
    'Sec-WebSocket-Key': key,
    Connection: 'Upgrade',
    Upgrade: 'websocket',
    ...opts.headers
  };
  opts.path = parsedUrl.pathname + parsedUrl.search;
  opts.timeout = opts.handshakeTimeout;

  if (opts.perMessageDeflate) {
    perMessageDeflate = new PerMessageDeflate(
      opts.perMessageDeflate !== true ? opts.perMessageDeflate : {},
      false,
      opts.maxPayload
    );
    opts.headers['Sec-WebSocket-Extensions'] = format({
      [PerMessageDeflate.extensionName]: perMessageDeflate.offer()
    });
  }
  if (protocols) {
    opts.headers['Sec-WebSocket-Protocol'] = protocols;
  }
  if (opts.origin) {
    if (opts.protocolVersion < 13) {
      opts.headers['Sec-WebSocket-Origin'] = opts.origin;
    } else {
      opts.headers.Origin = opts.origin;
    }
  }
  if (parsedUrl.username || parsedUrl.password) {
    opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
  }

  if (isUnixSocket) {
    const parts = opts.path.split(':');

    opts.socketPath = parts[0];
    opts.path = parts[1];
  }

  let req = (websocket._req = get(opts));

  if (opts.timeout) {
    req.on('timeout', () => {
      abortHandshake(websocket, req, 'Opening handshake has timed out');
    });
  }

  req.on('error', (err) => {
    if (websocket._req.aborted) return;

    req = websocket._req = null;
    websocket.readyState = WebSocket.CLOSING;
    websocket.emit('error', err);
    websocket.emitClose();
  });

  req.on('response', (res) => {
    const location = res.headers.location;
    const statusCode = res.statusCode;

    if (
      location &&
      opts.followRedirects &&
      statusCode >= 300 &&
      statusCode < 400
    ) {
      if (++websocket._redirects > opts.maxRedirects) {
        abortHandshake(websocket, req, 'Maximum redirects exceeded');
        return;
      }

      req.abort();

      const addr = new URL(location, address);

      initAsClient(websocket, addr, protocols, options);
    } else if (!websocket.emit('unexpected-response', req, res)) {
      abortHandshake(
        websocket,
        req,
        `Unexpected server response: ${res.statusCode}`
      );
    }
  });

  req.on('upgrade', (res, socket, head) => {
    websocket.emit('upgrade', res);

    //
    // The user may have closed the connection from a listener of the `upgrade`
    // event.
    //
    if (websocket.readyState !== WebSocket.CONNECTING) return;

    req = websocket._req = null;

    const digest = createHash('sha1')
      .update(key + GUID)
      .digest('base64');

    if (res.headers['sec-websocket-accept'] !== digest) {
      abortHandshake(websocket, socket, 'Invalid Sec-WebSocket-Accept header');
      return;
    }

    const serverProt = res.headers['sec-websocket-protocol'];
    const protList = (protocols || '').split(/, */);
    let protError;

    if (!protocols && serverProt) {
      protError = 'Server sent a subprotocol but none was requested';
    } else if (protocols && !serverProt) {
      protError = 'Server sent no subprotocol';
    } else if (serverProt && !protList.includes(serverProt)) {
      protError = 'Server sent an invalid subprotocol';
    }

    if (protError) {
      abortHandshake(websocket, socket, protError);
      return;
    }

    if (serverProt) websocket.protocol = serverProt;

    if (perMessageDeflate) {
      try {
        const extensions = parse(res.headers['sec-websocket-extensions']);

        if (extensions[PerMessageDeflate.extensionName]) {
          perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
          websocket._extensions[
            PerMessageDeflate.extensionName
          ] = perMessageDeflate;
        }
      } catch (err) {
        abortHandshake(
          websocket,
          socket,
          'Invalid Sec-WebSocket-Extensions header'
        );
        return;
      }
    }

    websocket.setSocket(socket, head, opts.maxPayload);
  });
}

/**
 * Create a `net.Socket` and initiate a connection.
 *
 * @param {Object} options Connection options
 * @return {net.Socket} The newly created socket used to start the connection
 * @private
 */
function netConnect(options) {
  options.path = options.socketPath;
  return net.connect(options);
}

/**
 * Create a `tls.TLSSocket` and initiate a connection.
 *
 * @param {Object} options Connection options
 * @return {tls.TLSSocket} The newly created socket used to start the connection
 * @private
 */
function tlsConnect(options) {
  options.path = undefined;

  if (!options.servername && options.servername !== '') {
    options.servername = options.host;
  }

  return tls.connect(options);
}

/**
 * Abort the handshake and emit an error.
 *
 * @param {WebSocket} websocket The WebSocket instance
 * @param {(http.ClientRequest|net.Socket)} stream The request to abort or the
 *     socket to destroy
 * @param {String} message The error message
 * @private
 */
function abortHandshake(websocket, stream, message) {
  websocket.readyState = WebSocket.CLOSING;

  const err = new Error(message);
  Error.captureStackTrace(err, abortHandshake);

  if (stream.setHeader) {
    stream.abort();
    stream.once('abort', websocket.emitClose.bind(websocket));
    websocket.emit('error', err);
  } else {
    stream.destroy(err);
    stream.once('error', websocket.emit.bind(websocket, 'error'));
    stream.once('close', websocket.emitClose.bind(websocket));
  }
}

/**
 * Handle cases where the `ping()`, `pong()`, or `send()` methods are called
 * when the `readyState` attribute is `CLOSING` or `CLOSED`.
 *
 * @param {WebSocket} websocket The WebSocket instance
 * @param {*} data The data to send
 * @param {Function} cb Callback
 * @private
 */
function sendAfterClose(websocket, data, cb) {
  if (data) {
    const length = toBuffer(data).length;

    //
    // The `_bufferedAmount` property is used only when the peer is a client and
    // the opening handshake fails. Under these circumstances, in fact, the
    // `setSocket()` method is not called, so the `_socket` and `_sender`
    // properties are set to `null`.
    //
    if (websocket._socket) websocket._sender._bufferedBytes += length;
    else websocket._bufferedAmount += length;
  }

  if (cb) {
    const err = new Error(
      `WebSocket is not open: readyState ${websocket.readyState} ` +
        `(${readyStates[websocket.readyState]})`
    );
    cb(err);
  }
}

/**
 * The listener of the `Receiver` `'conclude'` event.
 *
 * @param {Number} code The status code
 * @param {String} reason The reason for closing
 * @private
 */
function receiverOnConclude(code, reason) {
  const websocket = this[kWebSocket];

  websocket._socket.removeListener('data', socketOnData);
  websocket._socket.resume();

  websocket._closeFrameReceived = true;
  websocket._closeMessage = reason;
  websocket._closeCode = code;

  if (code === 1005) websocket.close();
  else websocket.close(code, reason);
}

/**
 * The listener of the `Receiver` `'drain'` event.
 *
 * @private
 */
function receiverOnDrain() {
  this[kWebSocket]._socket.resume();
}

/**
 * The listener of the `Receiver` `'error'` event.
 *
 * @param {(RangeError|Error)} err The emitted error
 * @private
 */
function receiverOnError(err) {
  const websocket = this[kWebSocket];

  websocket._socket.removeListener('data', socketOnData);

  websocket.readyState = WebSocket.CLOSING;
  websocket._closeCode = err[kStatusCode];
  websocket.emit('error', err);
  websocket._socket.destroy();
}

/**
 * The listener of the `Receiver` `'finish'` event.
 *
 * @private
 */
function receiverOnFinish() {
  this[kWebSocket].emitClose();
}

/**
 * The listener of the `Receiver` `'message'` event.
 *
 * @param {(String|Buffer|ArrayBuffer|Buffer[])} data The message
 * @private
 */
function receiverOnMessage(data) {
  this[kWebSocket].emit('message', data);
}

/**
 * The listener of the `Receiver` `'ping'` event.
 *
 * @param {Buffer} data The data included in the ping frame
 * @private
 */
function receiverOnPing(data) {
  const websocket = this[kWebSocket];

  websocket.pong(data, !websocket._isServer, NOOP);
  websocket.emit('ping', data);
}

/**
 * The listener of the `Receiver` `'pong'` event.
 *
 * @param {Buffer} data The data included in the pong frame
 * @private
 */
function receiverOnPong(data) {
  this[kWebSocket].emit('pong', data);
}

/**
 * The listener of the `net.Socket` `'close'` event.
 *
 * @private
 */
function socketOnClose() {
  const websocket = this[kWebSocket];

  this.removeListener('close', socketOnClose);
  this.removeListener('end', socketOnEnd);

  websocket.readyState = WebSocket.CLOSING;

  //
  // The close frame might not have been received or the `'end'` event emitted,
  // for example, if the socket was destroyed due to an error. Ensure that the
  // `receiver` stream is closed after writing any remaining buffered data to
  // it. If the readable side of the socket is in flowing mode then there is no
  // buffered data as everything has been already written and `readable.read()`
  // will return `null`. If instead, the socket is paused, any possible buffered
  // data will be read as a single chunk and emitted synchronously in a single
  // `'data'` event.
  //
  websocket._socket.read();
  websocket._receiver.end();

  this.removeListener('data', socketOnData);
  this[kWebSocket] = undefined;

  clearTimeout(websocket._closeTimer);

  if (
    websocket._receiver._writableState.finished ||
    websocket._receiver._writableState.errorEmitted
  ) {
    websocket.emitClose();
  } else {
    websocket._receiver.on('error', receiverOnFinish);
    websocket._receiver.on('finish', receiverOnFinish);
  }
}

/**
 * The listener of the `net.Socket` `'data'` event.
 *
 * @param {Buffer} chunk A chunk of data
 * @private
 */
function socketOnData(chunk) {
  if (!this[kWebSocket]._receiver.write(chunk)) {
    this.pause();
  }
}

/**
 * The listener of the `net.Socket` `'end'` event.
 *
 * @private
 */
function socketOnEnd() {
  const websocket = this[kWebSocket];

  websocket.readyState = WebSocket.CLOSING;
  websocket._receiver.end();
  this.end();
}

/**
 * The listener of the `net.Socket` `'error'` event.
 *
 * @private
 */
function socketOnError() {
  const websocket = this[kWebSocket];

  this.removeListener('error', socketOnError);
  this.on('error', NOOP);

  if (websocket) {
    websocket.readyState = WebSocket.CLOSING;
    this.destroy();
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
const WebSocket = __webpack_require__(/*! ws */ "./node_modules/ws/index.js");
const g = global;
g.WebSocket = WebSocket;
let storybooksChannel;
let establishedConnection = false;
/* EXPRESS SERVER & DEPENDENCY

import * as express from 'express';
import { resolveCliPathFromVSCodeExecutablePath } from 'vscode-test';
const server = express();

*/
/*
    class AesopPanel implements vscode.WebviewPanel {
        viewType
        title: string = 'Aesop'
        webview: vscode.Webview = new AesopWebview
        options: {retainContextWhenHidden: true}
        viewColumn: vscode.ViewColumn.Beside
        active: boolean = true
        visible: boolean = true
        onDidChangeViewState
        onDidDispose
        reveal
    }

    class AesopWebview implements vscode.Webview{
        asWebviewUri: any
        onDidReceiveMessage: any
        postMessage: any
        cspSource: any
        html: string =
        `<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Aesop</title>
            </head>
            <body>
                <iframe src="http://${host}:${PORT}/?path=/story/welcome--to-storybook></iframe>
            </body>
        </html>`
        options: vscode.WebviewOptions = new AesopWVOptions
    }

    class AesopWVOptions implements vscode.WebviewOptions{
        enableCommandUris: boolean = true
        enableScripts: boolean = true
        portMapping: [{
            webviewPort: number,
            extensionHostPort: number
        }]
    }

vscode.tasks.registerTaskProvider('runStorybook', {
    provideTasks(token?: vscode.CancellationToken) {
            return [
                    new vscode.Task({type: 'runStorybook'}, vscode.TaskScope.Workspace,
                            "Aesop Chronicle", "aesop", new vscode.ShellExecution(`npm run storybook --ci`))
            ];
    },
    resolveTask(task: vscode.Task, token?: vscode.CancellationToken) {
            return task;
    }
});

//define the script text to execute to the virtual terminal instance
const bootScript = `storybook --ci`;
const bootStorybook = new vscode.ProcessExecution(bootScript, {cwd: rootDir});

//now create a virtual terminal and execute our special npm script for it
//this first requires creating an eventEmitter that will fire that script
const scriptEmitter = new vscode.EventEmitter<string>();

//we also define a slave process Pseudoterminal (allowing Aesop to control the terminal)
const pty: vscode.Pseudoterminal = {
    onDidWrite: scriptEmitter.event,
    open: () =>	scriptEmitter.fire(bootScript),
    close: () => {},
    handleInput: data => new vscode.ShellExecution(data)
};

//should this just be an active terminal/shellExecution?
const virtualTerminal = vscode.window.createTerminal({name: 'sb-runner', pty});

//THIS WORKS, but we have no access to the DOM inside our webview//
//now let's read SB's outputted index.html file, and parse out what we need
    fs.readFile(path.join(rootDir, '/node_modules/@storybook/core/dist/public/index.html'), (err, data) => {
        if (err) console.error(err);
        else {
            let pulledHTML = data.toString();
            let targetPoint = pulledHTML.indexOf('</body>');
            let firstHalf = pulledHTML.slice(0, targetPoint);
            let secondHalf = pulledHTML.slice(targetPoint);
            pulledHTML = firstHalf.concat(payloadScript).concat(secondHalf);
            fs.writeFile(path.join(rootDir, '/node_modules/@storybook/core/dist/public/index.html'), pulledHTML, (err) => {
                if (err) console.error(err);
                else {
                    vscode.window.showInformationMessage('Successfully injected script');
                };
            });
        }
    });

//declare an empty array (of strings) to push our scripts to during the next part
    const scriptArray : Array<string> = [];
    //define a path to the root working directory of the user
    const rootDir = fileURLToPath(vscode.workspace.workspaceFolders[0].uri.toString(true));
    //now let's read SB's outputted index.html file, and parse out what we need
    fs.readFile(path.join(rootDir, '/node_modules/@storybook/core/dist/public/index.html'), (err, data) => {
        if (err) console.error(err);
        else {
            //if we've read the HTML file, take its contents and stringify it
            let outputFile = data.toString();
            // this log shows what our eventual permutations would look like as we carve out the scripts
            // vscode.window.showWarningMessage(`what's in it: ${outputFile.slice(outputFile.indexOf('<body>')+6, outputFile.indexOf('</body>'))} \n`)
            //split out the body section of the retrieved html file
            outputFile = outputFile.slice(outputFile.indexOf('<body>')+6, outputFile.indexOf('</body>'));
            vscode.window.showWarningMessage(`${outputFile} \n`)

            //this loop will peel out all the scripts so long as there are any to rip out
            while (outputFile.includes(`"<script src=`)){
                //we push just what we need (the src attributes), leaving the <script>...</script> tags behind
                let temp = outputFile.slice(outputFile.indexOf(`<script src="`)+12, outputFile.indexOf(`"></script>`));
                scriptArray.push(temp);
                outputFile = outputFile.slice(outputFile.indexOf(`"></script>`)+10);
            }
        };
    });

<div id="root"></div>
<div id="docs-root"></div>
<div id="scriptExecute">
<script>window.acquireVsCodeApi = acquireVsCodeApi();</script>
<script>window['DOCS_MODE'] = false;</script>
<script>
    ${
        scriptArray.map( (el) => {
            if (el.includes("./sb_dll")){
                let uiScript = document.createElement("script");
                uiScript.async = true;
                uiScript.defer = true;
                uiScript.referrerPolicy = "origin";
                uiScript.src = path.join(rootDir, `/node_modules/@storybook/core/dll/${el}`);
                document.getElementById("scriptExecute").appendChild(uiScript);
            }	else {
                let capturedScript = document.createElement("script");
                capturedScript.async = true;
                capturedScript.defer = true;
                capturedScript.referrerPolicy = "origin";
                capturedScript.src = path.join(rootDir, `/node_modules/@storybook/core/dist/public/${el}`);
                document.getElementById("scriptExecute").appendChild(capturedScript);
            }
        })
    }
</script>
</div>

disposable = vscode.commands.registerCommand('extension.getStories', () => {
    build a command that retrieves Storybook files on startup
    can be executed later if Storybook server is spun up after the extension opens
    
    also register this command at startup to crawl the file path
    ${vscode.commands.executeCommand('extension.getStories')}
    vscode.window.showInformationMessage('Aesop is reading from your Storybook.');

    define a path to SB webpack bundle outputs (in user workspace /node_modules/ folder)
    if (vscode.workspace.workspaceFolders[0] !== undefined){
        const distGlob = new vscode.RelativePattern(vscode.workspace.workspaceFolders[0], "**(remove)/node_modules/@storybook/core/dist/public");
        //instantiate a watcher to listen for fs path changes (e.g. file creation/update)
        //bools = options for ignoreCreateEvents?, ignoreChangeEvents?, ignoreDeleteEvents?
        const observer = vscode.workspace.createFileSystemWatcher(distGlob, false, false, false);
        // observer.onDidChange = //resolve//;		// observer.onDidCreate = //resolve//;
        //extract index.html file that outputs into SB's preview pane
        const htmlGlob = new vscode.RelativePattern(vscode.workspace.workspaceFolders[0], "*(remove)/node_modules/@storybook/core/dist/public/*.html");
        //extract necessary bundle scripts to leverage in-app dependencies
        const scriptGlob = new vscode.RelativePattern(vscode.workspace.workspaceFolders[0], "*(remove)/node_modules/@storybook/core/dist/public/*.js");

        console.log(vscode.Uri.file(fileURLToPath(`/node_modules/@storybook/core/dist/public`)));

        //do we need to resolve the Storybook UI script from the /dll/ folder?
        //if extract methods above fail, determine logic to parse out HTML/.js scripts (index 0?);
        //retrieve files with findFiles/relativeFilePath
        const arrayOfScripts = vscode.workspace.findFiles(distGlob, null, 100);
        //dev check: have we successfully pulled down script files?
        //if so, should we then store them locally, or is there no point?
        if (arrayOfScripts !== undefined){
            vscode.window.showInformationMessage("Hey, dog: " + `${arrayOfScripts}`);
        }

        vscode.window.showInformationMessage(`
        rootPath: ${vscode.workspace.workspaceFolders[0]},
        vscode.Uri: ${vscode.Uri},
        workspace: ${vscode.workspace},
        distGlob: ${distGlob.toString()},
        htmlGlob: ${htmlGlob.toString()},
        scriptGlob: ${scriptGlob.toString()}
        `);
    };

    vscode.window.showInformationMessage(`
        rootPath: ${vscode.workspace.workspaceFolders[0].uri.toString()},\n
        vscode URI parseTest: ${vscode.Uri.parse('file://'+ '/node_modules/@storybook/core/dist/public/index.html')},\n
        vscode URI parsed w escape: ${vscode.Uri.parse('file://'+ '/node_modules/\@storybook/core/dist/public/index.html')},\n
        vscode URI  file Test: ${vscode.Uri.file('node_modules/@storybook/core/dist/public/index.html')}
        `);
        
    console.log(`
    rootPath: ${vscode.workspace.workspaceFolders[0]},
    vscode.Uri: ${vscode.Uri},
    workspace: ${vscode.workspace},
    fileSys: ${vscode.Uri.file(path.join('/'))}`);
});

vscode.tasks.registerTaskProvider('runStorybook', {
    provideTasks(token?: vscode.CancellationToken) {
            return [
                    new vscode.Task({type: 'runStorybook'}, vscode.TaskScope.Workspace,
                            "Aesop Chronicle", "aesop", new vscode.ShellExecution(`npm run storybook --ci`))
            ];
    },
    resolveTask(task: vscode.Task, token?: vscode.CancellationToken) {
            return task;
    }
});

//define the script text to execute to the virtual terminal instance
const bootScript = `storybook --ci`;
const bootStorybook = new vscode.ProcessExecution(bootScript, {cwd: rootDir});

//now create a virtual terminal and execute our special npm script for it
//this first requires creating an eventEmitter that will fire that script
const scriptEmitter = new vscode.EventEmitter<string>();

//we also define a slave process Pseudoterminal (allowing Aesop to control the terminal)
const pty: vscode.Pseudoterminal = {
    onDidWrite: scriptEmitter.event,
    open: () =>	scriptEmitter.fire(bootScript),
    close: () => {},
    handleInput: data => new vscode.ShellExecution(data)
};

//should this just be an active terminal/shellExecution?
const virtualTerminal = vscode.window.createTerminal({name: 'sb-runner', pty});
*/
/* ALTERNATE APPROACH W/O PS-NODE LIBRARY

    export async function isProcessRunning(processName: string): Promise<boolean> {
    const cmd = (() => {
        switch (process.platform) {
            case 'win32': return `tasklist`
            case 'darwin': return `ps -ax | grep ${processName}`
            case 'linux': return `ps -A`
            default: return false
        }
    })()

    return new Promise((resolve, reject) => {
        require('child_process').exec(cmd, (err: Error, stdout: string, stderr: string) => {
            if (err) reject(err)

            resolve(stdout.toLowerCase().indexOf(processName.toLowerCase()) > -1)
        })
    })
}
const running: boolean = await isProcessRunning('myProcess')

*/
/* EXPRESS SERVER

    server.get('/', (req, res) => {
        vscode.window.showInformationMessage('Aesop server online');
        res.end();
    });
    server.listen(PORT);

*/
/*
//we need this to interface with/emit events to the storybook-channels websocket library
let previewUri = vscode.Uri.parse("storybook://authority/preview")

class WebviewHTMLProvider implements vscode.TextDocumentContentProvider {
    public provideTextDocumentContent(uri: vscode.Uri): string {
        //do we need to pass these arguments to the webviewprovider from our processes?
        //https://code.visualstudio.com/api/references/vscode-api#WorkspaceConfiguration
        //UPDATE configuration when found

        //'PORT' and 'host' have defaults configured manually in the package.json
        const port = vscode.workspace.getConfiguration("aesop").get("port")
        const host = vscode.workspace.getConfiguration("aesop").get("host")

        //this return value is what would normally get popped into the preview --> /?path=/story/${storyUri}
        return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Aesop</title>
                <style>
                iframe {
                    position: fixed;
                    border: none;
                    padding: 0;
                    margins: 0;
                    width: 100%;
                    height: 100%;
                }
            </style>
            </head>
            <body>
                <iframe src="http://${host}:${port}></iframe>
            </body>
        </html>`
    }
}

let provider = new WebviewHTMLProvider();
let webviewHTMLRegistration = vscode.workspace.registerTextDocumentContentProvider("storybook", provider);

//"storybook" is the scheme here; where is that defined? contributes?
const storyTreeViewProvider = new TreeViewProvider();
vscode.window.registerTreeDataProvider("storybook", storyTreeViewProvider);
const pickerProvider = new QuickPickProvider(storyTreeViewProvider);

let previewDisposable = vscode.commands.registerCommand("extension.showStorybookPreview", () => {
    //maybe we can use a blank webview and REASSIGN its html each time with a boilerplate HTML file and an iframe spot for the html fired at previewHtml here

    return vscode.commands.executeCommand("vscode.previewHtml", previewUri, vscode.ViewColumn.Two, "Storybooks").then(
  success => {},
  //should really (by convention) use a .catch() method for the error (call it "error", not "reason")
  reason => {
    vscode.window.showErrorMessage(reason)
  }
)
})

context.subscriptions.push(previewDisposable, webviewHTMLRegistration);

storybooksChannel = createChannel({ url: `ws://${host}:${port}`, async: true, onError: () => {} })

//declares variables with no initial value, reassigns at each request
var currentKind: string = null
var currentStory: string = null
var currentStoryId: string = null

// Create a statusbar item to reconnect, when we lose connection
const reconnectStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
reconnectStatusBarItem.command = "extension.restartConnectionToStorybooks"
if (establishedConnection) {
reconnectStatusBarItem.text = "Reconnect Storybooks"
reconnectStatusBarItem.color = "#FF8989"
} else {
reconnectStatusBarItem.text = "Connect to Storybooks"
}

reconnectStatusBarItem.hide()

// when we (re-)connect to Storybook's server, pass the WS connection to this func, so callbacks can occur on new socket connection

const registerCallbacks = channel => {

// Called when we first get stories from the Storybook server
// may have to add logic that executes a getStories command after the webview has been served up by the primary Aesop Awaken function
//setStories is a method defined on the websocket connection

channel.on("setStories", data => {
  //this configuration exists in package.json, and defines a filter that is initialised to a "."
  //this is probably configurable in the extension settings, something we still have to tackle
  //we should also think about the store presentation, logo, Readme...

  //TO FOLLOW UP: why use this filter? what is it reading? the DOM on the server?

  const filter = vscode.workspace.getConfiguration("react-native-storybooks").get("storybookFilterRegex") as string
  const regex = new RegExp(filter)

  //use Story interface to init this variable (id: string, name: string)
  let stories: Story[] = []

  //gets the data returned from the socket when calling setStories, we see if the data has a property "stories" which contains an Array of usable elements

  if (Array.isArray(data.stories)) {
    //if the data contains a stories property that is an Array
    //declare a variable kinds that:
    //inits to an empty Object but takes a type assertion of:
    //Object -> [key]: value = array of Story Objects
    
    let kinds: { [key: string]: StoryObject[] } = {}
    //this is basically asking if the stories returned from the data have a "kind" property, and if the kind contains a period
    const storydata = data.stories.filter(s => s.kind.match(regex))

    storydata.map(story => {
      story.stories.map(singleStory => {
        if (kinds[story.kind] == undefined) {
          // kinds[story.kind] = [story.name]
          kinds[story.kind] = [{ name: singleStory, id: singleStory }]
        } else {
          kinds[story.kind].push({ name: singleStory, id: singleStory })
        }
      })
    })
    Object.keys(kinds).forEach(function(key) {
      stories.push({
        kind: key,
        stories: kinds[key]
      })
    })
  } else {
    let kinds: { [key: string]: StoryObject[] } = {}
    Object.keys(data.stories).forEach(function(key) {
      const story = data.stories[key]
      if (story.kind.match(regex)) {
        if (kinds[story.kind] == undefined) {
          // kinds[story.kind] = [story.name]
          kinds[story.kind] = [{ name: story.name, id: story.id }]
        } else {
          kinds[story.kind].push({ name: story.name, id: story.id })
        }
      }
    })
    Object.keys(kinds).forEach(function(key) {
      stories.push({
        kind: key,
        stories: kinds[key]
      })
    })
  }
  storyTreeViewProvider.stories = stories
  storyTreeViewProvider.refresh()
  reconnectStatusBarItem.hide()
})

// When the server in RN starts up, it asks what should be default
channel.on("getCurrentStory", () => {
  storybooksChannel.emit("setCurrentStory", {
    storyId: currentStoryId
  })
})

// The React Native server has closed
channel.transport.socket.onclose = () => {
  storyTreeViewProvider.stories = []
  storyTreeViewProvider.refresh()
  reconnectStatusBarItem.show()
}

channel.emit("getStories")
}

registerCallbacks(storybooksChannel)

vscode.commands.registerCommand("extension.searchStories", () => {
vscode.window.showQuickPick(pickerProvider.toList()).then((picked: string) => {
  const setParams = pickerProvider.getParts(picked)
  setCurrentStory(setParams)
})
})

// Allow clicking, and keep state on what is selected
vscode.commands.registerCommand("extension.openStory", (section, story) => {
// Handle a Double click
if (currentStoryId === story.id && currentKind === section.kind && currentStory === story.name) {
  findFileForStory(section.kind, story.name).then(results => {
    if (results) {
      vscode.workspace.openTextDocument(results.uri).then(doc => {
        vscode.window.showTextDocument(doc).then(shownDoc => {
          let range = doc.lineAt(results.line - 1).range
          vscode.window.activeTextEditor.selection = new vscode.Selection(range.start, range.end)
          vscode.window.activeTextEditor.revealRange(range, vscode.TextEditorRevealType.InCenter)
        })
      })
    }
  })
  return
}

setCurrentStory({ storyId: story.id, kind: section.kind, story: story.name })
})

function setCurrentStory(params: StorySelection) {
const currentChannel = () => storybooksChannel
currentKind = params.kind
currentStory = params.story
currentStoryId = params.storyId
currentChannel().emit("setCurrentStory", params)
}

//when connecting to storybook, create a websocket connection
//then pass it as an argument to the registerCallbacks function
vscode.commands.registerCommand("extension.connectToStorybooks", () => {
storybooksChannel = createChannel({ url: `ws://${host}:${port}`, async: true, onError: () => {} })
registerCallbacks(storybooksChannel)
})

vscode.commands.registerCommand("extension.restartConnectionToStorybooks", () => {
storybooksChannel = createChannel({ url: `ws://${host}:${port}`, async: true, onError: () => {} })
registerCallbacks(storybooksChannel)
})

vscode.commands.registerCommand("extension.goToNextStorybook", () => {
const stories = storyTreeViewProvider.stories
const currentSection = stories.find(s => s.kind === currentKind)
const currentStories = currentSection.stories
const currentIndex = currentStories.map(e => e.id).indexOf(currentStoryId)
if (currentIndex === currentStories.length) {
  // if you have reached the last story of an array of stories, enables the ability to wrap around
  vscode.commands.executeCommand("extension.openStory", currentSection, currentStories[0])
} else {

  vscode.commands.executeCommand("extension.openStory", currentSection, currentStories[currentIndex + 1])
}
})

vscode.commands.registerCommand("extension.goToPreviousStorybook", () => {
const stories = storyTreeViewProvider.stories
const currentSection = stories.find(s => s.kind === currentKind)
const currentStories = currentSection.stories
const currentIndex = currentStories.map(e => e.id).indexOf(currentStoryId)
if (currentIndex === 0) {
  // if you have reached the last story of an array of stories, enables the ability to wrap around
  vscode.commands.executeCommand("extension.openStory", currentSection, currentStories[currentStories.length - 1])
} else {
  vscode.commands.executeCommand("extension.openStory", currentSection, currentStories[currentIndex - 1])
}
})

vscode.commands.registerCommand("extension.expandAllStories", () => {
storyTreeViewProvider.expandAll()
})

vscode.commands.registerCommand("extension.collapseAllStories", () => {
storyTreeViewProvider.collapseAll()
})
}
*/
// Loop through all globbed stories,
// reading the files for the kind and the story name
// const findFileForStory = async (kind: string, story: string): Promise<{ uri: vscode.Uri; line: number } | null> => {
//   return new Promise<{ uri: vscode.Uri; line: number }>((resolve, reject) => {
//     //this regex is set as a glob expression in package.json that finds **.story.* files
//     const regex = vscode.workspace.getConfiguration("react-native-storybooks").get("storyRegex") as string
//     const root = vscode.workspace.workspaceFolders
//     vscode.workspace.findFiles(regex, "**/node_modules").then(files => {
//       let found = false
//       for (const file of files) {
//         const content = fs.readFileSync(file.fsPath, "utf8")
//         if (content.includes(kind) && content.includes(story)) {
//           const line = content.split(story)[0].split("\n").length
//           resolve({ uri: file, line })
//           found = true
//         }
//       }
//       if (!found) {
//         resolve(null)
//       }
//     })
//   })
// }
function activate(context) {
    let port = vscode.workspace.getConfiguration("aesop").get("port");
    let host = vscode.workspace.getConfiguration("aesop").get("host");
    vscode.window.showInformationMessage(`Port default to ${port}`);
    //set context "aesop-awake" to true; enabling views
    vscode.commands.executeCommand("setContext", "aesop-awake", true);
    //create disposable to register Aesop Awaken command to subscriptions
    let disposable = vscode.commands.registerCommand('extension.aesopAwaken', () => {
        //declare variable to toggle whether running Node processes have been checked
        let checkedProcesses = false;
        //declare variable to toggle whether a running SB process was found
        let foundSb = false;
        //define a path to the user's root working directory
        const rootDir = url_1.fileURLToPath(vscode.workspace.workspaceFolders[0].uri.toString(true));
        //first test whether Storybook has been depended into your application
        fs.access(path.join(rootDir, '/node_modules/@storybook'), (err) => {
            const statusText = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
            statusText.text = "[Aesop] Looking for Storybook dependency...";
            statusText.color = "#FF8989";
            //if the filepath isn't found, show the user what Aesop is reading as the root path
            if (err) {
                vscode.window.showErrorMessage(`Aesop could not find Storybook as a dependency in the active folder, ${rootDir}`);
                statusText.dispose();
            }
            else {
                //check to see if a storybook node process is already running
                if (checkedProcesses === false) {
                    ps.lookup({ command: 'node', psargs: 'ux' }, (err, resultList) => {
                        if (err) {
                            vscode.window.showErrorMessage(`Failed looking for running Node processes. Error: ${err}`);
                            statusText.dispose();
                        }
                        else {
                            //notify the user that Aesop is checking for a running Storybook instance
                            statusText.text = `[Aesop] Reviewing running processes...`;
                            //if the process lookup was able to find running processes, iterate through to review them
                            resultList.forEach((process) => {
                                /* OUTPUT LOGGER */
                                fs.writeFile(path.join(rootDir, 'YOLO.txt'), `Attempted launch log:\n`, (err) => { console.log(`Couldn't output process information to YOLO.txt: ${err}`); });
                                //check if any running processes are Storybook processes
                                if (process.arguments[0].includes('storybook')) {
                                    //stretch goal: check for multiple instances of storybook and reconcile
                                    //if so, extract port number and use that value to populate the webview with that contents
                                    const pFlagIndex = process.arguments.indexOf('-p');
                                    if (pFlagIndex !== -1) {
                                        port = parseInt(process.arguments[pFlagIndex + 1]);
                                    }
                                    /* OUTPUT LOGGER */
                                    fs.appendFile(path.join(rootDir, 'YOLO.txt'), `This process matches for 'storybook':\n
									PID: ${process.pid}, COMMAND:${process.command}, ARGUMENTS: ${process.arguments}\n
									PORT has been assigned to: ${port}`, (err) => { console.log(err); });
                                    //set foundSb to true to prevent our function from running another process
                                    foundSb = true;
                                    statusText.text = `[Aesop] Retrieving your running Storybook...`;
                                } //---> close if process.arguments[0] contains storybook
                            }); //---> close resultList.forEach()
                            //having checked running Node processes, set that variable to true
                            checkedProcesses = true;
                            //if no processes matched 'storybook', we will have to spin up the storybook server
                            if (checkedProcesses === true && foundSb === false) {
                                //starts by checking for/extracting any port flages from the SB script in the package.json
                                fs.readFile(path.join(rootDir, 'package.json'), (err, data) => {
                                    if (err) {
                                        vscode.window.showErrorMessage(`Aesop is attempting to read ${rootDir}. Is there a package.json file here?`);
                                    }
                                    else {
                                        statusText.text = `[Aesop] Checking your Storybook scripts in package.json...`;
                                        //enter the package.JSON file and retrieve its contents as an object
                                        let packageJSON = JSON.parse(data.toString());
                                        let storybookScript = packageJSON.scripts.storybook;
                                        /* OUTPUT LOGGER */
                                        fs.appendFile(path.join(rootDir, 'YOLO.txt'), `Here is the script for "storybook":\n
										${storybookScript}`, (err) => { console.log(err); });
                                        //iterate through the text string (stored on "storybook" key) and parse out port flag
                                        //it is more helpful to split it into an array separated by whitespace to grab this
                                        let retrievedScriptArray = storybookScript.split(' ');
                                        for (let i = 0; i < retrievedScriptArray.length; i++) {
                                            //stretch goal: add logic for other flags as we implement further functionality
                                            if (retrievedScriptArray[i] === '-p') {
                                                port = parseInt(retrievedScriptArray[i + 1]);
                                                /* OUTPUT LOGGER */
                                                fs.appendFile(path.join(rootDir, 'YOLO.txt'), `Port from script":\n${parseInt(retrievedScriptArray[i + 1])}\n
												Port at this moment:\n${port}\n`, (err) => { console.log(err); });
                                                break;
                                            }
                                            else if (i === retrievedScriptArray.length - 1) {
                                                //termination case: when you have reached the end of the script in the 'for' loop
                                                //ADD LOGIC TO HANDLE WHEN NO SCRIPT FLAG IS GIVEN
                                                /* OUTPUT LOGGER */
                                                fs.appendFile(path.join(rootDir, 'YOLO.txt'), `Script found, but no port flag detected.\n
												Port when no port flag found:\n${port}\n`, (err) => { console.log(err); });
                                            }
                                        }
                                        //possible: add --ci tag to existing package.json with an fs function?
                                        //e.g. process.scripts.storybook = `${storybookScript} --ci`, then write
                                        //now launch the child process on the port you've derived
                                        const runSb = child_process.spawn('npm', ['run', 'storybook']);
                                        vscode.window.showInformationMessage("Done looking. Aesop will now run Storybook for you.");
                                        runSb.stdout.setEncoding('utf8');
                                        let counter = 0;
                                        runSb.stdout.on('data', (data) => {
                                            let str = data.toString();
                                            let lines = str.split(" ");
                                            counter += 1;
                                            if (counter === 3) {
                                                const path = lines[171];
                                                const regExp = (/[^0-9]/g);
                                                port = parseInt(path.replace(regExp, ""));
                                            }
                                            let sbPortFlag = '-p';
                                            if (lines.includes(sbPortFlag)) {
                                                const indexOfP = lines.indexOf(sbPortFlag);
                                                vscode.window.showInformationMessage(`This is indexOfP: `, indexOfP);
                                                if (indexOfP !== -1) {
                                                    port = parseInt(lines[indexOfP + 1]);
                                                    vscode.window.showInformationMessage(`storybook is now running on port: ${port}`);
                                                }
                                            }
                                        });
                                        runSb.on('error', (err) => {
                                            console.log(err);
                                            process.exit(1);
                                        });
                                        //This will make sure the child process is terminated on process exit
                                        runSb.on('close', (code) => {
                                            console.log(`child process exited with code ${code}`);
                                        });
                                    }
                                });
                            } //close spin up server
                        }
                        ; //CLOSE else psLookup
                    }); //close ps LOOKUP
                } //close depend found, not checked processes
            } //close else statement in fs.access
        }); //close fs access
    }); //close disposable
    context.subscriptions.push(disposable);
    let openDisposable = vscode.commands.registerCommand('extension.aesopChronicle', () => {
        const panel = vscode.window.createWebviewPanel('aesop-sb', 'Aesop', vscode.ViewColumn.Beside, {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.file(context.extensionPath)]
        });
        //here's where I need logic to fill html
        panel.webview.html = `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Aesop</title>
			</head>
			<body>
				<iframe src="http://${host}:${port}/?path=/story/welcome--to-storybook></iframe>
			</body>
		</html>`;
    });
    context.subscriptions.push(openDisposable);
}
exports.activate = activate;
function deactivate() {
    // storybooksChannel.transport.socket.close()
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

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

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

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("net");

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

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("tls");

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

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ })

/******/ });
//# sourceMappingURL=extension.js.map