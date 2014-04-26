define({ api: [
  {
    "group": "addTransfer",
    "type": "SushiJSON",
    "url": "addTransfer:{JSON}",
    "title": "add transfer with protocol. root > transferIdentity(protocol) > connectionIdentity.",
    "examples": [
      {
        "title": "[example]",
        "content": "addTransfer: {\n  \"transferIdentity\": \"testAdditionalSushiJSONServer\",\n  \"connectionIdentity\": \"testAdditionalSushiJSONConnection\",\n  \"protocol\": \"RunSushiJSONServer\",\n  \"params\": {\n      \"path\": \"SUBLIMESOCKET_PATH:tests/testResources/sample_SushiJSON.txt\"\n  },\n  \"selectors\": [\n      {\n          \"showAtLog<-transferIdentity\": {\n              \"format\": \"transfer [transferIdentity] added.\"\n          }\n      }\n  ]\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "transferIdentity",
            "optional": false,
            "description": "the transfer's identity of the new transfer's first connection."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "connectionIdentity",
            "optional": false,
            "description": "the connection's identity of the new transfer's first connection."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "protocol",
            "optional": false,
            "description": "the protocol of the new transfer."
          },
          {
            "group": "Parameter",
            "type": "JSON",
            "field": "params",
            "optional": false,
            "description": "the parameters for setup of the new transfer."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "afterAsync",
    "type": "SushiJSON",
    "url": "afterAsync:{JSON}",
    "title": "go to next API and run selectors after milliseconds",
    "examples": [
      {
        "title": "[example]",
        "content": "afterAsync: {\n  \"identity\": \"testIdentity\",\n  \"ms\": 100,\n  \"selectors\": [\n      {\n          \"showAtLog\": {\n              \"message\": \"hello after 100\"\n          }\n      }\n  ]\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "identity",
            "optional": false,
            "description": "identifier of this async block."
          },
          {
            "group": "Parameter",
            "type": "Int",
            "field": "ms",
            "optional": false,
            "description": "run selectors after this milliseconds."
          },
          {
            "group": "Parameter",
            "type": "Selectors",
            "field": "selectors",
            "optional": false,
            "description": "selectors."
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "Everything",
            "field": "keys_and_values",
            "optional": false,
            "description": "this api injects all keys and values to selectors."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "appendRegion",
    "type": "SushiJSON",
    "url": "appendRegion:{JSON}",
    "title": "append region and input parameter to the file",
    "examples": [
      {
        "title": "[example]",
        "content": "appendRegion: {\n  \"name\": \"target.txt\",\n  \"line\": \"1\",\n  \"message\": \"test\",\n  \"condition\": \"keyword\"\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "the target file's last part of file path or fullpath."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "message",
            "optional": false,
            "description": "message contents. will raise event."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "condition",
            "optional": false,
            "description": "set the color of region. \"keyword\", \"string\", and more. depends on Sublime Text's theme."
          },
          {
            "group": "Parameter",
            "type": "Selectors(Optional)",
            "field": "selectors",
            "optional": false,
            "description": "selectors."
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "String",
            "field": "path",
            "optional": false,
            "description": "the full path of the file."
          },
          {
            "group": "Injects",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "the name of the file."
          },
          {
            "group": "Injects",
            "type": "String",
            "field": "identity",
            "optional": false,
            "description": "automatically defined identity."
          },
          {
            "group": "Injects",
            "type": "Int",
            "field": "line",
            "optional": false,
            "description": "the line count where the region located."
          },
          {
            "group": "Injects",
            "type": "Int",
            "field": "from",
            "optional": false,
            "description": "start point of region."
          },
          {
            "group": "Injects",
            "type": "Int",
            "field": "to",
            "optional": false,
            "description": "end point of region."
          },
          {
            "group": "Injects",
            "type": "String",
            "field": "message",
            "optional": false,
            "description": "the message parameter of the region."
          },
          {
            "group": "Injects",
            "type": "String",
            "field": "condition",
            "optional": false,
            "description": "the condition parameter of the region."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "changeIdentity",
    "type": "SushiJSON",
    "url": "changeIdentity:{JSON}",
    "title": "chamge identity of specified transfer's connection.",
    "examples": [
      {
        "title": "[example]",
        "content": "changeIdentity: {\n  \"from\": \"sublimesockettest\",\n  \"to\": \"test\",\n  \"injects\": {\n      \"from\": \"from\",\n      \"to\": \"to\"\n  },\n  \"selectors\": [\n      {\n          \"showAtLog<-from, to\": {\n              \"format\": \"[from] becomes [to].\"\n          }\n      }\n  ]\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String(Optional)",
            "field": "from",
            "optional": false,
            "description": "specify the target connection's identity which will be renamed. if not, requested connection's identitiy will be used."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "to",
            "optional": false,
            "description": "value for rename."
          },
          {
            "group": "Parameter",
            "type": "String(Optional)",
            "field": "transfer",
            "optional": false,
            "description": "'s identity which has connection of the target. if not, requested transfer's identitiy will be used."
          },
          {
            "group": "Parameter",
            "type": "Selectors(Optional)",
            "field": "selectors",
            "optional": false,
            "description": "selectors."
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "String",
            "field": "from",
            "optional": false,
            "description": "the identity before changed."
          },
          {
            "group": "Injects",
            "type": "String",
            "field": "to",
            "optional": false,
            "description": "the identity after changed."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "clearSelection",
    "type": "SushiJSON",
    "url": "clearSelection:{JSON}",
    "title": "clear the selection of file",
    "examples": [
      {
        "title": "[example]",
        "content": "clearSelection: {\n  \"name\": \"clearSelection.txt\",\n  \"selectors\": [\n      {\n          \"showAtLog<-name, cleards\": {\n              \"format\": \"[name] + [cleards].\"\n          }\n      }\n  ]\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "the target file's last part of file path or fullpath."
          },
          {
            "group": "Parameter",
            "type": "Selectors(Optional)",
            "field": "selectors",
            "optional": false,
            "description": "selectors."
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "String",
            "field": "path",
            "optional": false,
            "description": "target file's path."
          },
          {
            "group": "Injects",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "target file's name."
          },
          {
            "group": "Injects",
            "type": "Array",
            "field": "cleards",
            "optional": false,
            "description": "the list of cleared [from] and [to]."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "closeAllBuffer",
    "type": "SushiJSON",
    "url": "closeAllBuffer:{JSON}",
    "title": "close all buffers.",
    "examples": [
      {
        "title": "[example]",
        "content": "closeAllBuffer: {\n  \"injects\": {\n      \"closeds\": \"message\"\n  },\n  \"selectors\": [\n      {\n          \"showAtLog<-message\": {}\n      }\n  ]\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Selectors(Optional)",
            "field": "selectors",
            "optional": false,
            "description": "selectors."
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "String[]",
            "field": "closeds",
            "optional": false,
            "description": "the list of closed buffer's names."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "closeAllFiles",
    "type": "SushiJSON",
    "url": "closeAllFiles:{JSON}",
    "title": "close all files or close excepted-specific named files.",
    "examples": [
      {
        "title": "[example]",
        "content": "closeAllFiles: {\n  \"dryrun\": true,\n  \"selectors\": [\n      {\n          \"showAtLog<-closeds\": {\n              \"format\": \"[closeds]\"\n          }\n      }\n  ]\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String(Optional)",
            "field": "excepts",
            "optional": false,
            "description": "the list of file names which do not want to close."
          },
          {
            "group": "Parameter",
            "type": "Bool(Optional)",
            "field": "dryrun",
            "optional": false,
            "description": "the flag for debug."
          },
          {
            "group": "Parameter",
            "type": "Selectors(Optional)",
            "field": "selectors",
            "optional": false,
            "description": "selectors."
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "Strings",
            "field": "closeds",
            "optional": false,
            "description": "the list of closed file's full path."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "closeFile",
    "type": "SushiJSON",
    "url": "closeFile:{JSON}",
    "title": "open the file which is exist.",
    "examples": [
      {
        "title": "[example]",
        "content": "closeFile: {\n  \"name\": \"sample.txt\"\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "the target file's last part of file path or fullpath."
          },
          {
            "group": "Parameter",
            "type": "Selectors(Optional)",
            "field": "selectors",
            "optional": false,
            "description": "selectors."
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "the name = last path part of the closed file."
          },
          {
            "group": "Injects",
            "type": "String",
            "field": "path",
            "optional": false,
            "description": "the full path of the closed file."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "collectViews",
    "type": "SushiJSON",
    "url": "collectViews:{JSON}",
    "title": "collect all window's all opened file's path",
    "examples": [
      {
        "title": "[example]",
        "content": "collectViews: {\n  \"selectors\": [\n      {\n          \"showAtLog<-collecteds\": {\n              \"format\": \"[collecteds]\"\n          }\n      }\n  ]\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Selectors(Optional)",
            "field": "selectors",
            "optional": false,
            "description": "selectors."
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "Array",
            "field": "collecteds",
            "optional": false,
            "description": "all opened file's paths."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "connectedCall",
    "type": "SushiJSON",
    "url": "connectedCall:{}",
    "title": "raise SublimeSocketServer's connected event.",
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "countUp",
    "type": "SushiJSON",
    "url": "countUp:{JSON}",
    "title": "count up mechanism. if the label was already defined, countup it.",
    "examples": [
      {
        "title": "[example]",
        "content": "countUp: {\n  \"label\": \"countIdentity\",\n  \"default\": 0\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "label",
            "optional": false,
            "description": "identifier of the count machine. countup if same label is defined."
          },
          {
            "group": "Parameter",
            "type": "Int",
            "field": "default",
            "optional": false,
            "description": "the first value of the count."
          },
          {
            "group": "Parameter",
            "type": "Selectors(Optional)",
            "field": "selectors",
            "optional": false,
            "description": "selectors."
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "String",
            "field": "label",
            "optional": false,
            "description": "inputted label."
          },
          {
            "group": "Injects",
            "type": "Int",
            "field": "count",
            "optional": false,
            "description": "the count after define/countup."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "createBuffer",
    "type": "SushiJSON",
    "url": "createBuffer:{JSON}",
    "title": "create the named buffer.",
    "examples": [
      {
        "title": "[example]",
        "content": "createBuffer: {\n  \"name\": \"test\",\n  \"selectors\": [\n      {\n          \"showAtLog<-name\": {\n              \"format\": \"[name] created.\"\n          }\n      }\n  ]\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "set the name of buffer."
          },
          {
            "group": "Parameter",
            "type": "String(Optional)",
            "field": "contents",
            "optional": false,
            "description": "the contents of buffer. create, named then insert contents to the buffer."
          },
          {
            "group": "Parameter",
            "type": "Selectors(Optional)",
            "field": "selectors",
            "optional": false,
            "description": "selectors."
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "Strings",
            "field": "name",
            "optional": false,
            "description": "the name of buffer."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "defineFilter",
    "type": "SushiJSON",
    "url": "defineFilter:{JSON}",
    "title": "define regexp filter & selector, use with filtering API",
    "examples": [
      {
        "title": "[example]",
        "content": "defineFilter: {\n  \"name\": \"test\",\n  \"filters\": [\n      {\n          \"(.*)1 (.*)2 ([0-9].*?)a3 (.*)4\": {\n              \"injects\": {\n                  \"groups[3]\": \"name\",\n                  \"groups[1]\": \"add\",\n                  \"groups[2]\": \"to\"\n              },\n              \"selectors\": [\n                  {\n                      \"showAtLog<-name, add, to\": {\n                          \"format\": \"[name], [add], [to]\"\n                      }\n                  }\n              ],\n              \"dotall\": false\n          }\n      },\n      {\n          \"(.*)\": {\n              \"selectors\": [\n                  {\n                      \"showAtLog<-groups[0]\": {\n                          \"format\": \"[groups[0]]\"\n                      }\n                  }\n              ]\n          }\n      }\n  ],\n  \"selectors\": [\n      {\n          \"showAtLog<-name, patterns\": {\n              \"format\": \"[name], [patterns]\"\n          }\n      }\n  ]\n}->filtering: {\n  \"name\": \"test\",\n  \"source\": \"the1 test2 4a3 nestedFilterCase.txt4\"\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "the name of filter."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "regexp",
            "optional": false,
            "description": "regular expression for filtering. Matched parameters will injects as [groups[INDEX]](partial) and [group](whole)"
          },
          {
            "group": "Parameter",
            "type": "Selectors",
            "field": "selectors",
            "optional": false,
            "description": "selectors of filter. automatically injects matched parameters."
          },
          {
            "group": "Parameter",
            "type": "String(Optional)",
            "field": "comments",
            "optional": false,
            "description": "comment for the filter. show if filtering contains debug: true."
          },
          {
            "group": "Parameter",
            "type": "Bool(Optional)",
            "field": "dotall",
            "optional": false,
            "description": "use dotall option of regexp. By default false."
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "filter's path."
          },
          {
            "group": "Injects",
            "type": "String",
            "field": "patterns",
            "optional": false,
            "description": "defined regexp patterns."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "eraseAllRegions",
    "type": "SushiJSON",
    "url": "eraseAllRegions:{JSON}",
    "title": "erase all regions(sometimes this API fails...)",
    "examples": [
      {
        "title": "[example]",
        "content": "eraseAllRegions: {\n  \"injects\": {\n      \"deletes\": \"message\"\n  },\n  \"selectors\": [\n      {\n          \"showAtLog<-message\": {}\n      }\n  ]\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "the target file's last part of file path or fullpath."
          },
          {
            "group": "Parameter",
            "type": "Selectors(Optional)",
            "field": "selectors",
            "optional": false,
            "description": "selectors."
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "Array",
            "field": "deletes",
            "optional": false,
            "description": "deleted regions's [from] and [to] pairs."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "eventEmit",
    "type": "SushiJSON",
    "url": "eventEmit:{JSON}",
    "title": "emit specific event",
    "examples": [
      {
        "title": "[example]",
        "content": "eventEmit: {\n  \"event\": \"event_eventWithIdentity\",\n  \"sample-key\": \"sample-value\"\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "event",
            "optional": false,
            "description": "event name. shoud start with [event_]."
          },
          {
            "group": "Parameter",
            "type": "*(Optional)",
            "field": "*",
            "optional": false,
            "description": "This API is vector of any key-param value. Can emit event with any keys and values of injected."
          },
          {
            "group": "Parameter",
            "type": "Selectors(Optional)",
            "field": "selectors",
            "optional": false,
            "description": "selectors."
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "String",
            "field": "event",
            "optional": false,
            "description": "emitted event name."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "filtering",
    "type": "SushiJSON",
    "url": "filtering:{JSON}",
    "title": "input source string to specific filter, use with defineFilter API",
    "examples": [
      {
        "title": "[example]",
        "content": "filtering: {\n  \"name\": \"test\",\n  \"source\": \"the1 test2 4a3 nestedFilterCase.txt4\",\n  \"debug\": true\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "the target filter's name."
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "source",
            "optional": false,
            "description": "the input for regexp filtering."
          },
          {
            "group": "Parameter",
            "type": "Bool(Optional)",
            "field": "debug",
            "optional": false,
            "description": "show debug info. By default false."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "inputToTransfer",
    "type": "SushiJSON",
    "url": "inputToTransfer:{JSON}",
    "title": "input data to transfer. Behaviour is depends on protocol.",
    "examples": [
      {
        "title": "[example]",
        "content": "now loading...\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "transferIdentity",
            "optional": false,
            "description": "the target transfer's identity. Raise error if not exist."
          },
          {
            "group": "Parameter",
            "type": "JSON",
            "field": "params",
            "optional": false,
            "description": "the parameters for input of the transfer."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "modifyView",
    "type": "SushiJSON",
    "url": "modifyView:{JSON}",
    "title": "modify specific view",
    "examples": [
      {
        "title": "[example]",
        "content": "modifyView: {\n  \"name\": \"sample.txt\",\n  \"add\": \"1\"\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "the target file's last part of file path or fullpath."
          },
          {
            "group": "Parameter",
            "type": "String(Optional)",
            "field": "add",
            "optional": false,
            "description": "add string value. if position is not specified, add the end of file."
          },
          {
            "group": "Parameter",
            "type": "String(Optional)",
            "field": "to",
            "optional": false,
            "description": "the point to insert."
          },
          {
            "group": "Parameter",
            "type": "String(Optional)",
            "field": "line",
            "optional": false,
            "description": "the line to insert."
          },
          {
            "group": "Parameter",
            "type": "Selectors(Optional)",
            "field": "selectors",
            "optional": false,
            "description": "selectors."
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "String",
            "field": "path",
            "optional": false,
            "description": "modified file's path."
          },
          {
            "group": "Injects",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "modified file's name."
          },
          {
            "group": "Injects",
            "type": "Int",
            "field": "line",
            "optional": false,
            "description": "modified file's specified line."
          },
          {
            "group": "Injects",
            "type": "Int",
            "field": "to",
            "optional": false,
            "description": "modified file's specified point."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "openFile",
    "type": "SushiJSON",
    "url": "openFile:{JSON}",
    "title": "open the file which is exist.",
    "examples": [
      {
        "title": "[example]",
        "content": "openFile: {\n  \"path\": \"SUBLIMESOCKET_PATH:tests/testResources/sample.txt\",\n  \"selectors\": [\n      {\n          \"showAtLog<-name\": {\n              \"format\": \"opened [name]\"\n          }\n      }\n  ]\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "path",
            "optional": false,
            "description": "open file if exist. or not, do nothing."
          },
          {
            "group": "Parameter",
            "type": "Selectors(Optional)",
            "field": "selectors",
            "optional": false,
            "description": "selectors."
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "the name = last path part of the file."
          },
          {
            "group": "Injects",
            "type": "String",
            "field": "path",
            "optional": false,
            "description": "the full path of the file."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "removeTransfer",
    "type": "SushiJSON",
    "url": "removeTransfer:{JSON}",
    "title": "remove transfer with transferIdentity.",
    "examples": [
      {
        "title": "[example]",
        "content": "now loading...\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "transferIdentity",
            "optional": false,
            "description": "the transfer's identity for remove."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "resetCounts",
    "type": "SushiJSON",
    "url": "resetCounts:{JSON}",
    "title": "reset the labeled count.",
    "examples": [
      {
        "title": "[example]",
        "content": "resetCounts: {\n  \"label\": \"countIdentity\"\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String(Optional)",
            "field": "label",
            "optional": false,
            "description": "identifier of the count machine. countup if same label is defined. reset all if not specified."
          },
          {
            "group": "Parameter",
            "type": "Selectors(Optional)",
            "field": "selectors",
            "optional": false,
            "description": "selectors."
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "Strings",
            "field": "resetted",
            "optional": false,
            "description": "the list of labels which was resetted."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "resetReactors",
    "type": "SushiJSON",
    "url": "resetReactors:{JSON}",
    "title": "reset all reactors.",
    "examples": [
      {
        "title": "[example]",
        "content": "resetReactors: {\n              \n}\n"
      }
    ],
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "Strings[]",
            "field": "deleteds",
            "optional": false,
            "description": "deleted reactor's names."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "resetReactors",
    "type": "SushiJSON",
    "url": "resetReactors:{JSON}",
    "title": "reset all reactors.",
    "examples": [
      {
        "title": "[example]",
        "content": "resetReactors: {\n              \n}\n"
      }
    ],
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "Strings[]",
            "field": "deleteds",
            "optional": false,
            "description": "deleted reactor's names."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "runSelectorsWithInjects",
    "type": "SushiJSON",
    "url": "runSelectorsWithInjects:{JSON}",
    "title": "run \"selectos\" with specific injection of keys & values.",
    "examples": [
      {
        "title": "[example]",
        "content": "runSelectorsWithInjects: {\n\"injects\": {\n\"key1\": \"key2\"\n},\n  \"selectors\": [\n      {\n          \"showAtLog<-key2\": {\n              \"format\": \"injected [key2]\"\n          }\n      }\n  ]\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "field": "injects",
            "optional": false,
            "description": "the pair of before-after key name transform."
          },
          {
            "group": "Parameter",
            "type": "Selectors",
            "field": "selectors",
            "optional": false,
            "description": "the selectors which run with injects all keys & values."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "runSushiJSON",
    "type": "SushiJSON",
    "url": "runSushiJSON:{JSON}",
    "title": "run SushiJSON formatted string as APISuites.",
    "examples": [
      {
        "title": "[example]",
        "content": "runSushiJSON: {\n  \"path\": \"SUBLIMESOCKET_PATH:tests/testResources/sample_SushiJSON.txt\",\n  \"selectors\": [\n      {\n          \"showAtLog<-logs\": {\n              \"format\": \"runSetting logs:[logs]\"\n          }\n      }\n  ]\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String(Optional)",
            "field": "path",
            "optional": false,
            "description": "the path of SushiJSON descripted file."
          },
          {
            "group": "Parameter",
            "type": "String(Optional)",
            "field": "data",
            "optional": false,
            "description": "the strings of SushiJSON."
          },
          {
            "group": "Parameter",
            "type": "Selectors(Optional)",
            "field": "selectors",
            "optional": false,
            "description": "selectors."
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "Strings",
            "field": "logs",
            "optional": false,
            "description": "the list of the SushiJSON's result = \"showAtLog\" message which was running inside path / data."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "selectedRegions",
    "type": "SushiJSON",
    "url": "selectedRegions:{JSON}",
    "title": "output the contents of region if the selection contains region",
    "examples": [
      {
        "title": "[example]",
        "content": "setViewReactor: {\n  \"react\": \"on_selection_modified\",\n  \"reactors\": [\n      {\n          \"selectedRegions<-name, selecteds\": {\n              \"isexactly\": false,\n              \"selectors\": [\n                  {\n                      \"showAtLog<-line, from, to\": {\n                          \"format\": \"L:[line], ([from], [to])\"\n                      }\n                  }\n              ]\n          }\n      }\n  ]\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "the name of file."
          },
          {
            "group": "Parameter",
            "type": "List",
            "field": "selecteds",
            "optional": false,
            "description": "the list of selections. e,g, [ [from1, to1], [from2, to2] ]."
          },
          {
            "group": "Parameter",
            "type": "Bool(Optional)",
            "field": "isexactly",
            "optional": false,
            "description": "if false, react with contains region exactly. By default this is true."
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "String",
            "field": "path",
            "optional": false,
            "description": "the full path of the file."
          },
          {
            "group": "Injects",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "the name of the file."
          },
          {
            "group": "Injects",
            "type": "String",
            "field": "crossed",
            "optional": false,
            "description": "the displayed contents of the selected region."
          },
          {
            "group": "Injects",
            "type": "Int",
            "field": "line",
            "optional": false,
            "description": "the line count where the selected region located."
          },
          {
            "group": "Injects",
            "type": "Int",
            "field": "from",
            "optional": false,
            "description": "start point of region."
          },
          {
            "group": "Injects",
            "type": "Int",
            "field": "to",
            "optional": false,
            "description": "end point of region."
          },
          {
            "group": "Injects",
            "type": "String",
            "field": "message",
            "optional": false,
            "description": "the message parameter of the selected region."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "setEventReactor",
    "type": "SushiJSON",
    "url": "setEventReactor:{JSON}",
    "title": "set self-defined event reactor. run when the reactive-event/foundation-event appeared.",
    "examples": [
      {
        "title": "[example]",
        "content": "setEventReactor: {\n  \"react\": \"event_accept_event\",// you can define it. must starts with \"event_\" prefix.\n  \"reactors\": [\n      {\n          \"showAtLog\": {\n              \"message\": \"hereComes\"\n          }\n      },\n      {\n          \"showAtLog<-messageFromEventEmit\": {\n              \"format\": \"from [messageFromEventEmit]\"\n          }\n      }\n  ]\n}->eventEmit: {\n  \"messageFromEventEmit\": \"the message from eventEmit\"\n}\n"
      },
      {
        "title": "[example of receive foundation event]",
        "content": "setEventReactor: {\n  \"react\": \"ss_f_noViewFound\",\n  \"reactors\": [\n      {\n          \"showAtLog<-name\": {\n              \"message\": \"no view found\",\n              \"format\": \"view [name] not found.\"\n          }\n      }\n  ],\n  \"selectors\": [\n      {\n          \"showAtLog<-delay\": {\n              \"format\": \"[delay]\"\n          }\n      }\n  ]\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "react",
            "optional": false,
            "description": "target event name."
          },
          {
            "group": "Parameter",
            "type": "JSON",
            "field": "reactors",
            "optional": false,
            "description": "run when target-event/foundation-event appeared."
          },
          {
            "group": "Parameter",
            "type": "Int(Optional)",
            "field": "delay",
            "optional": false,
            "description": "milliseconds. delay ignore running reactors, when the event appeared multitimes in this delay."
          },
          {
            "group": "Parameter",
            "type": "Selectors(Optional)",
            "field": "selectors",
            "optional": false,
            "description": "selectors."
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "JSON",
            "field": "reactors",
            "optional": false,
            "description": "reactors block."
          },
          {
            "group": "Injects",
            "type": "Int",
            "field": "delay",
            "optional": false,
            "description": "0 or inputted value."
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Injects via reactors": [
          {
            "group": "Injects via reactors",
            "type": "String",
            "field": "identity",
            "optional": false,
            "description": "the generated uuid4 string for each event."
          },
          {
            "group": "Injects via reactors",
            "type": "Everything",
            "field": "keys_and_values",
            "optional": false,
            "description": "run when this event appeared. run with caller API's injects."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "setSelection",
    "type": "SushiJSON",
    "url": "setSelection:{JSON}",
    "title": "set selection to the file.",
    "examples": [
      {
        "title": "[example]",
        "content": "setSelection: {\n  \"name\": \"sample.txt\",\n  \"selections\": [\n      {\n          \"from\": 10,\n          \"to\": 11\n      }\n  ]\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "the target file's last part of file path or fullpath."
          },
          {
            "group": "Parameter",
            "type": "Dictionary",
            "field": "selections",
            "optional": false,
            "description": "pair of key-value of selecting regions. [from]:Int and [to]:Int"
          },
          {
            "group": "Parameter",
            "type": "Selectors(Optional)",
            "field": "selectors",
            "optional": false,
            "description": "selectors."
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "Event",
            "field": "ss_on_selection_modified_by_setselection",
            "optional": false,
            "description": "the ss_on_selection_modified_by_setselection event will raise."
          },
          {
            "group": "Injects",
            "type": "String",
            "field": "path",
            "optional": false,
            "description": "selected file's path."
          },
          {
            "group": "Injects",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "selected file's name."
          },
          {
            "group": "Injects",
            "type": "Array",
            "field": "selecteds",
            "optional": false,
            "description": "the list of [from] and [to]."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "setViewReactor",
    "type": "SushiJSON",
    "url": "setViewReactor:{JSON}",
    "title": "set defined view-event reactor. run when the event appeared.",
    "name": "b",
    "examples": [
      {
        "title": "[example]",
        "content": "setViewReactor: {\n  \"react\": \"on_post_save\",\n  \"reactors\": [\n      {\n         \"showAtLog<-name\": {\n              \"format\": \"name is [name]\"\n          }\n      }\n  ]\n}\n"
      },
      {
        "title": "[view-events]",
        "content": "on_new\non_clone\non_close\non_load\non_modified\non_query_completions\non_pre_save\non_post_save\non_selection_modified\nss_on_selection_modified_by_setselection\nss_v_decreased\nss_v_increased\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "react",
            "optional": false,
            "description": "target event name."
          },
          {
            "group": "Parameter",
            "type": "JSON",
            "field": "reactors",
            "optional": false,
            "description": "run when target-event/foundation-event appeared."
          },
          {
            "group": "Parameter",
            "type": "Int(Optional)",
            "field": "delay",
            "optional": false,
            "description": "milliseconds. delay ignore running reactors, when the event appeared multitimes in this delay."
          },
          {
            "group": "Parameter",
            "type": "Selectors(Optional)",
            "field": "selectors",
            "optional": false,
            "description": "selectors."
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "JSON",
            "field": "reactors",
            "optional": false,
            "description": "reactors block."
          },
          {
            "group": "Injects",
            "type": "Int",
            "field": "delay",
            "optional": false,
            "description": "0 or inputted value."
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Injects via reactors": [
          {
            "group": "Injects via reactors",
            "type": "String",
            "field": "path",
            "optional": false,
            "description": "the full path of the file. if the file is not exist, = buffer, path becomes name of buffer."
          },
          {
            "group": "Injects via reactors",
            "type": "String",
            "field": "name",
            "optional": false,
            "description": "the last path of the file."
          },
          {
            "group": "Injects via reactors",
            "type": "[[Int, Int]]",
            "field": "selecteds",
            "optional": false,
            "description": "the list of list(from, to)."
          },
          {
            "group": "Injects via reactors",
            "type": "Bool",
            "field": "isExist",
            "optional": false,
            "description": "the view is exist or not."
          },
          {
            "group": "Injects via reactors",
            "type": "String",
            "field": "identity",
            "optional": false,
            "description": "the generated uuid4 string for each event."
          },
          {
            "group": "Injects via reactors",
            "type": "ViewInstance",
            "field": "view",
            "optional": false,
            "description": "the instance of view.(not good to use. use \"name\", \"path\" to find file.)"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "startTailing(deprecated)",
    "type": "SushiJSON",
    "url": "startTailing:{JSON}",
    "title": "start tailing the target file and run reactor.",
    "examples": [
      {
        "title": "[example]",
        "content": "startTailing: {\n  \"identity\": \"startTailing\",\n  \"path\": \"SUBLIMESOCKET_PATH:tests/testResources/runShellTarget.txt\",\n  \"reactors\": [\n      {\n          \"showAtLog<-source\": {\n              \"format\": \"tailed, [source]\"\n          }\n      }\n  ],\n  \"selectors\": [\n  ]\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "identity",
            "optional": false,
            "description": "identifier of this tail process.(only defined. no usage yet.)"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "path",
            "optional": false,
            "description": "the target file path. must be full-path."
          },
          {
            "group": "Parameter",
            "type": "JSON",
            "field": "reactors",
            "optional": false,
            "description": "run when tailed-data incoming. \"source\" param will be injected."
          },
          {
            "group": "Parameter",
            "type": "Selectors",
            "field": "selectors",
            "optional": false,
            "description": "selectors."
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "String",
            "field": "path",
            "optional": false,
            "description": "the tail-started file path."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "tearDown",
    "type": "SushiJSON",
    "url": "tearDown:{}",
    "title": "teardown the SublimeSocket Server itself.",
    "examples": [
      {
        "title": "[example]",
        "content": "tearDown: {}\n"
      }
    ],
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "versionVerify",
    "type": "SushiJSON",
    "url": "versionVerify:{JSON}",
    "title": "check SublimeSocket version from client.",
    "examples": [
      {
        "title": "[example]",
        "content": "versionVerify: {\n  \"socketVersion\": 3,\n  \"apiVersion\": \"1.-1.0\",\n  \"injects\": {\n      \"code\": \"code\",\n      \"message\": \"theMessage\"\n  },\n  \"selectors\": [\n      {\n          \"showAtLog<-code, theMessage\": {\n              \"format\": \"[code] [theMessage]\"\n          }\n      }\n  ]\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "field": "socketVersion",
            "optional": false,
            "description": "the version of expected SublimeSocket version.(2 or 3)"
          },
          {
            "group": "Parameter",
            "type": "String",
            "field": "apiVersion",
            "optional": false,
            "description": "the version of expected SublimeSocket API version.(a.b.c)"
          },
          {
            "group": "Parameter",
            "type": "Selectors(Optional)",
            "field": "selectors",
            "optional": false,
            "description": "selectors."
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Injects": [
          {
            "group": "Injects",
            "type": "Int",
            "field": "code_2",
            "optional": false,
            "description": "(2) VERIFICATION_CODE_VERIFIED_CLIENT_UPDATE"
          },
          {
            "group": "Injects",
            "type": "Int",
            "field": "code_1",
            "optional": false,
            "description": "(1) VERIFICATION_CODE_VERIFIED"
          },
          {
            "group": "Injects",
            "type": "Int",
            "field": "code_0",
            "optional": false,
            "description": "(0) VERIFICATION_CODE_REFUSED_DIFFERENT_SUBLIMESOCKET"
          },
          {
            "group": "Injects",
            "type": "Int",
            "field": "code_-1",
            "optional": false,
            "description": "(-1) VERIFICATION_CODE_REFUSED_SUBLIMESOCKET_UPDATE"
          },
          {
            "group": "Injects",
            "type": "Int",
            "field": "code_-2",
            "optional": false,
            "description": "(-2) VERIFICATION_CODE_REFUSED_CLIENT_UPDATE"
          },
          {
            "group": "Injects",
            "type": "String",
            "field": "message",
            "optional": false,
            "description": "result message of verification."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  },
  {
    "group": "wait",
    "type": "SushiJSON",
    "url": "wait:{JSON}",
    "title": "wait milliseconds and go to next.",
    "examples": [
      {
        "title": "[example]",
        "content": "wait:{\n  \"ms\": 200\n}\n"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Int",
            "field": "ms",
            "optional": false,
            "description": "wait milliseconds."
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/Users/highvision/Library/Application Support/Sublime Text 3/Packages/SublimeSocket3/SublimeSocketAPISettings.py"
  }
] });