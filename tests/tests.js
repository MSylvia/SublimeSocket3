beforeafter>thebeforeafterselectors/selector: {
    "beforeselectors": [],
    "afterselectors": [
        {
            "closeAllBuffer": {
                
            }
        },
        {
            "resetReactors": {
                
            }
        },
        {
            "showAtLog": {
                "message": "test over"
            }
        }
    ]
}


test>helloWorld/showAtLog: {
    "message": "hello world."
}->assertResult: {
    "id": "helloWorld",
    "contains": {
        "showAtLog": {
            "output": "hello world."
        }
    },
    "description": "not match."
}


test>setEventReactor: {
    "react": "event_eventWithIdentity",
    "reactors": [
        {
            "showAtLog<-identity": {
                "format": "the [identity]"
            }
        }
    ]
}->eventEmit: {
    "event": "event_eventWithIdentity"
}->assertResult: {
    "id": "eventEmit can emit event with identity",
    "isnotempty": "showAtLog",
    "description": "not match."
}


test>regionを現在のviewに表示する/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->setViewReactor: {
    "react": "ss_f_noViewFound",
    "reactors": [
        {
            "showAtLog": {
                "message": "noViewFound fired."
            }
        }
    ]
}->viewEmit: {
    "identity": "show region on this view",
    "name": "ss_viewkey_current",
    "selectors": [
        {
            "appendRegion<-name": {
                "line": 1,
                "message": "test",
                "condition": "keyword",
                "selectors": [
                    {
                        "showAtLog": {
                            "message": "displayed."
                        }
                    }
                ]
            }
        }
    ]
}->assertResult: {
    "id": "show region on this view.",
    "contains": {
        "showAtLog": {
            "output": "displayed."
        }
    },
    "description": "not match."
}->eraseAllRegions: {

}


test>readFileからselectors/readFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt",
    "injects": {
        "data": "data",
        "originalpath": "originalpath"
    }, 
    "selectors": [
        {
            "showAtLog<-data, originalpath": {
                "format": "[originalpath], [data]"
            }
        }
    ]
}->assertResult: {
    "id": "get file's contents, then show at log.",
    "contains": {
        "showAtLog": {
            "output": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt, a\nb\nc"
        }
    },
    "description": "not match."
}


test>バッファを作り、appendRegionし、閉じて、eraseAllRegionssする/createBuffer: {
    "name": "bufferForAddRegionThenEraseAfterClosed.txt"
}->appendRegion: {
    "name": "bufferForAddRegionThenEraseAfterClosed.txt",
    "line": "1",
    "message": "test",
    "condition": "keyword"
}->closeAllBuffer: {

}->eraseAllRegions: {
    "selectors": [
        {
            "showAtLog<-deletes": {
                "format": "[deletes]"
            }
        }
    ]
}->assertResult: {
    "id": "ST3: eraseAllRegionss never run.",
    "contains": {
        "showAtLog": {
            "output": "{}"
        }
    },
    "description": "not match."
}


test>setSelectionと合わせて、toolTipの箇所にscrollする/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample3.txt"
}->setViewReactor: {
    "react": "ss_on_selection_modified_by_setselection",
    "reactors": [
        {
            "transform<-name, selecteds": {
                "code": "
name = inputs[\"name\"]\n
tail = inputs[\"selecteds\"][0][1]\n
output({\"name\":name, \"tail\":tail, \"message\":str(tail)})
                ",
                "injects": {
                    "name": "name",
                    "tail": "tail",
                    "message": "message"
                },
                "selectors": [
                    {
                        "showAtLog<-name, tail": {
                            "format": "[name] and [tail]."
                        }
                    },
                    {
                        "showToolTip<-name, tail, message": {
                            "injects": {
                                "name": "name",
                                "tail": "count",
                                "message": "message"
                            },
                            "onselected": [
                                {
                                    "will show!": [
                                        {
                                            "showAtLog<-message": {
                                                
                                            }
                                        }
                                    ]
                                    
                                }
                            ],
                            "oncancelled": [],
                            "finally": [
                                {
                                    "scrollTo<-name, count": {

                                    }
                                }
                            ]
                        }

                    }
                ]
            }
        }
    ]
}->setSelection: {
    "name": "sample3.txt",
    "selections": [
        {
            "from": 10,
            "to": 11
        }
    ]
}->assertResult: {
    "id": "setSelection cause viewReactor, transform, showAtLog, then showToolTip.",
    "contains": {
        "showAtLog": {
            "output": "sample3.txt and 11."
        }
    },
    "description": "not match."
}->closeFile: {
    "name": "sample3.txt"
}


test>lineでscrollする/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample3.txt"
}->scrollTo: {
    "name": "sample3.txt",
    "line": 30,
    "selectors": [
        {
            "showAtLog": {
                "message": "scroll done."
            }
        }
    ]
}->assertResult: {
    "id": "scroll to line",
    "contains": {
        "showAtLog": {
            "output": "scroll done."
        }
    },
    "description": "not match."
}->closeFile: {
    "name": "sample3.txt"
}


test>countでscrollする/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample3.txt"
}->scrollTo: {
    "name": "sample3.txt",
    "count": 130,
    "selectors": [
        {
            "showAtLog": {
                "message": "scroll done 2."
            }
        }
    ]
}->assertResult: {
    "id": "scroll to line",
    "contains": {
        "showAtLog": {
            "output": "scroll done 2."
        }
    },
    "description": "not match."
}->closeFile: {
    "name": "sample3.txt"
}


test>lineとcountがセットされている場合、lineでscrollする/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample3.txt"
}->scrollTo: {
    "name": "sample3.txt",
    "count": 130,
    "line": 30,
    "selectors": [
        {
            "showAtLog": {
                "message": "scroll done 3."
            }
        }
    ]
}->assertResult: {
    "id": "scroll to line",
    "contains": {
        "showAtLog": {
            "output": "scroll done 3."
        }
    },
    "description": "not match."
}->closeFile: {
    "name": "sample3.txt"
}


test>APIDefined以外のinjectsを反映させる/createBuffer: {
    "name": "inject.txt"
}->viewEmit: {
    "identity": "test for out of APIDefined injection",
    "name": "inject.txt",
    "injects": {
        "name": "message"
    },
    "selectors": [
        {
            "showAtLog<-message": {

            }
        }
    ]
}->assertResult: {
    "id": "viewEmit to selectors.",
    "contains": {
        "showAtLog": {
            "output": "inject.txt"
        }
    },
    "description": "not match."
}


test>defineFilterでinjectsを使わない場合/defineFilter: {
    "name": "defineFilterWithoutInjects",
    "filters": [
        {
            "(.*), (.*)": {
                "selectors": [
                    {
                        "showAtLog<-groups[0], groups[1]": {
                            "format": "hahaha, [groups[0]], [groups[1]]"
                        }
                    }
                ]
            }
        }
    ]
}->filtering: {
    "name": "defineFilterWithoutInjects",
    "source": "a, b"
}->assertResult: {
    "id": "defineFilter without injects.",
    "contains": {
        "showAtLog": {
            "output": "hahaha, a, b"
        }
    },
    "description": "not match."
}


test>nestしたfilterでのバグ、selectorの変更が効かない、かと思ったが、injectsの非交換バグだった。/createBuffer: {
    "name": "nestedFilterCase.txt"
}->defineFilter: {
    "name": "quickfix",
    "filters": [
        {
            "(.*)1 (.*)2 ([0-9].*?)a3 (.*)4": {
                "injects": {
                    "groups[3]": "name",
                    "groups[1]": "add",
                    "groups[2]": "to"
                },
                "selectors": [
                    {
                        "showToolTip<-name, add, to": {
                            "injects": {
                                "name": "name",
                                "add": "add",
                                "to": "to"
                            },
                            "onselected": [
                                {
                                    "fix?": [
                                        {
                                            "modifyView<-name, add, to": {
                                                
                                            }
                                        },
                                        {
                                            "showAtLog<-add": {
                                                "format": "the [add] will be add-ed."
                                            }
                                        }
                                    ]
                                }
                            ],
                            "oncancelled": [
                                
                            ]
                        }
                    }
                ]
            }
        }
    ]
}->filtering: {
    "name": "quickfix",
    "source": "the1 test2 4a3 nestedFilterCase.txt4"
}->assertResult: {
    "id": "ST3: inject works with out of APIDefined injection.",
    "contains": {
        "showAtLog": {
            "output": "the test will be add-ed."
        }
    },
    "description": "not match."
}


test>transformにcodeを使う/transform: {
    "code": "output({\"message\":\"hereComes\"})",
    "selectors": [
        {
            "showAtLog<-message": {
                
            }
        }
    ]
}->assertResult: {
    "id": "transform uses the code made from json",
    "contains": {
        "showAtLog": {
            "output": "hereComes"
        }
    },
    "description": "not match."
}


test>transformに、無理して長文を書く/transform: {
    "code": "
import os\n
for a in \"abc\":\n
\tprint(\"\", a)\n
output({\"message\":\"hereComes2\"})",
    "selectors": [
        {
            "showAtLog<-message": {
                
            }
        }
    ]
}->assertResult: {
    "id": "transform uses the code made from json 2",
    "contains": {
        "showAtLog": {
            "output": "hereComes2"
        }
    },
    "description": "not match."
}


test>transformでlistとdictを扱う/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->viewEmit: {
    "name": "sample.txt",
    "identity": "allParamTransformer",
    "selectors": [
        {
            "allValueInjectionのテスト/transform<-path, body": {
                "transformerpath": "SUBLIMESOCKET_PATH:tests/testResources/listTransformer.py",
                "selectors": [
                    {
                        "showToolTip<-name, onselected": {
                            "oncancelled": [
                                
                            ]
                        }
                    }
                ],
                "debug": true
            }
        }
    ]
}->assertResult: {
    "id": "ST3: transform with list and dict.",
    "contains": {
        "showAtLog": {
            "output": "this is a"
        }
    },
    "description": "not match."
}->closeFile: {
    "name": "sample.txt"
}


test>transformでparamsAをparamsBに変更する。/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->viewEmit: {
    "name": "sample.txt",
    "identity": "allParamTransformer",
    "selectors": [
        {
            "allValueInjectionのテスト、全要素を並べてtoolTipにする/transform<-": {
                "transformerpath": "SUBLIMESOCKET_PATH:tests/testResources/toolTipTransformer.py",
                "selectors": [
                    {
                        "showToolTip<-name, onselected, oncancelled": {
                            
                        }
                    }
                ],
                "debug": true
            }
        }
    ]
}->assertResult: {
    "id": "ST3: APIName<- means all param injection.",
    "contains": {
        "showAtLog": {
            "output": "here comes a as a daredevil!!"
        }
    },
    "description": "not match."
}->closeFile: {
    "name": "sample.txt"
}


test>quickFix的な機構のテスト、appendRegionからのToolTip、filterでの入力でコードを打ち込む。/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->defineFilter: {
    "name": "quickfix-adoptable-pattern",
    "filters": [
        {
            "^(.*)": {
                "selectors": [
                    {
                        "showAtLog<-groups[0]": {
                            "format": "quickfix ready. [groups[0]]"
                        }
                    }
                ]
            }
        }
    ]
}->showToolTip: {
    "name": "sample.txt",
    "onselected": [
        {
            "sample": [
                {
                    "transform<-selectedtitle": {
                        "transformerpath": "SUBLIMESOCKET_PATH:tests/testResources/setSelectedNameToFilter.py",
                        "selectors": [
                            {
                                "filtering<-source": {
                                    "name": "quickfix-adoptable-pattern"
                                }
                            }
                        ]
                    }
                }
            ]
        }
    ],
    "oncancelled": [
        
    ]
}->assertResult: {
    "id": "ST3: set quickfix",
    "contains": {
        "showAtLog": {
            "output": "quickfix ready. sample"
        }
    },
    "description": "not match."
}->closeFile: {
    "name": "sample.txt"
}


test>viewEmitで別途injectを使う/createBuffer: {
    "name": "injectionWithViewEmit.txt"
}->viewEmit: {
    "identity": "injectionWithViewEmit",
    "name": "injectionWithViewEmit.txt",
    "injects": {
        "path": "message"
    },
    "selectors": [
        {
            "showAtLog<-message": {
                
            }
        }
    ]
}->assertResult: {
    "id": "inject message param from viewEmit's path param.",
    "contains": {
        "showAtLog": {
            "output": "injectionWithViewEmit.txt"
        }
    },
    "description": "not match."
}


test>parameterInjectの上書き内容に関するaccept制約のテスト。bodyに関する値だけを受け取るので、pathの値が変化したい。/createBuffer: {
    "name": "view2.txt"
}->viewEmit: {
    "identity": "viewForInjectContents",
    "name": "view2.txt",
    "selectors": [
        {
            "showAtLog<-body": {
                "format": "path [body]."
            }
        }
    ]
}->assertResult: {
    "id": "no path replacement",
    "contains": {
        "showAtLog": {
            "output": "path ."
        }
    },
    "description": "not match."
}


test>openFileで、存在しないファイルを開いた場合、即閉じる/openFile: {
    "path": "notExistFile",
    "selectors": [
        {
            "showAtLog<-path, name": {
                "format": "[path], [name]"
            }
        }
    ]
}->assertResult: {
    "id": "cannot open not exist file",
    "notcontains": {
        "showAtLog": {
            "output": "notExistFile, notExistFile"
        }
    },
    "description": "not match."
}


test>完了通知が出ない。突破してはいる。組み合わせでエラーが出ていたのを解消したもの。viewの切り替え問題を含んでいた。/createBuffer: {
    "name": "completionTestView.txt"
}->viewEmit: {
    "identity": "completionTestView",
    "name": "completionTestView.txt",
    "selectors": [
        {
            "このCompletionはnameを使っているのでキー間違いで着火しない。あくまで再現用。/runCompletion<-name": {
                "completion": [
                    {
                        "HEAD": "DrawLine",
                        "paramsTargetFmt": "(${1:start}, ${2:end}, ${3:color}, ${4:duration}, ${5:depthTest})",
                        "return": "Void",
                        "paramsTypeDef": "(Vector3,Vector3,Color,Single,Boolean)",
                        "head": "DrawLine"
                    }
                ],
                "formathead": "HEADparamsTypeDef\treturn",
                "formattail": "headparamsTargetFmt$0"
            }
        }
    ]
}->setViewReactor: {
    "react": "ss_v_increased",
    "reactors": [
        {
            "showAtLog": {
                "message": "increased."
            }
        }
    ]
}->openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->modifyView: {
    "name": "sample.txt",
    "add": "1"
}->assertResult: {
    "id": "ST3: view text increased",
    "contains": {
        "showAtLog": {
            "output": "increased."
        }
    },
    "description": "not match."
}->closeFile: {
    "name": "sample.txt"
}


test>modifyView と selectors/createBuffer: {
    "name": "bufferForModifyThenRunSelectors"
}->modifyView: {
    "name": "bufferForModifyThenRunSelectors",
    "count": 1,
    "add": "some",
    "injects": {
        "add": "message"
    },
    "selectors": [
        {
            "showAtLog<-message": {}
        }
    ]
}->assertResult: {
    "id": "modifyView with selectors.",
    "contains": {
        "showAtLog": {
            "output": "some"
        }
    },
    "description": "not match."
}


test>modifyViewの行数指定バージョン/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->modifyView: {
    "name": "sample.txt",
    "add": "\n1",
    "line": 3
}->viewEmit: {
    "name": "sample.txt",
    "identity": "addToLine",
    "selectors": [
        {
            "showAtLog<-body": {
                "format": "[body]"
            }
        }
    ]
}->assertResult: {
    "id": "ST3: view line increased",
    "contains": {
        "showAtLog": {
            "output": "a\nb\nc\n1"
        }
    },
    "description": "not match."
}->closeFile: {
    "name": "sample.txt"
}


test>modifyViewのポイント指定バージョン/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->modifyView: {
    "name": "sample.txt",
    "add": "1",
    "to": 2
}->viewEmit: {
    "name": "sample.txt",
    "identity": "addToLine",
    "selectors": [
        {
            "showAtLog<-body": {
                "format": "[body]"
            }
        }
    ]
}->assertResult: {
    "id": "ST3: view line increased 2",
    "contains": {
        "showAtLog": {
            "output": "a\n1b\nc"
        }
    },
    "description": "not match."
}->closeFile: {
    "name": "sample.txt"
}


test>補完を外部からセット、そのままウインドウ表示する。候補が2つ以上のため、補完ウインドウが表示される。/createBuffer: {
    "name": "completionTestView2.txt"
}->runCompletion: {
    "name": "completionTestView2.txt",
    "completion": [
        {
            "HEAD": "DrawLine",
            "paramsTargetFmt": "(${1:start}, ${2:end}, ${3:color}, ${4:duration}, ${5:depthTest})",
            "return": "Void",
            "paramsTypeDef": "(Vector3,Vector3,Color,Single,Boolean)",
            "head": "DrawLine"
        },
        {
            "HEAD": "DrawLine",
            "paramsTargetFmt": "(${1:start}, ${2:end}, ${3:color}, ${4:duration}, ${5:depthTest})",
            "return": "Void",
            "paramsTypeDef": "(Vector3,Vector3,Color,Single,Boolean)",
            "head": "DrawLine"
        }
    ],
    "formathead": "HEADparamsTypeDef\treturn",
    "formattail": "headparamsTargetFmt$0",
    "selectors": [
        {
            "showAtLog<-name": {
                "format": "runCompletion done at [name]"
            }
        }
    ]
}->assertResult: {
    "id": "runCompletion includes 2 completion",
    "contains": {
        "showAtLog": {
            "output": "runCompletion done at completionTestView2.txt"
        }
    },
    "description": "not match."
}


test>補完ウインドウを表示してcancelCompletionで閉じる/createBuffer: {
    "name": "completionCloseTestView.txt"
}->viewEmit: {
    "identity": "completionCloseTestView",
    "name": "completionCloseTestView.txt",
    "selectors": [
        {
            "runCompletion<-name": {
                "completion": [
                    {
                        "HEAD": "DrawLine",
                        "paramsTargetFmt": "(${1:start}, ${2:end}, ${3:color}, ${4:duration}, ${5:depthTest})",
                        "return": "Void",
                        "paramsTypeDef": "(Vector3,Vector3,Color,Single,Boolean)",
                        "head": "DrawLine"
                    },
                    {
                        "HEAD": "DrawLine",
                        "paramsTargetFmt": "(${1:start}, ${2:end}, ${3:color}, ${4:duration}, ${5:depthTest})",
                        "return": "Void",
                        "paramsTypeDef": "(Vector3,Vector3,Color,Single,Boolean)",
                        "head": "DrawLine"
                    }
                ],
                "formathead": "HEADparamsTypeDef\treturn",
                "formattail": "headparamsTargetFmt$0"
            }
        }
    ]
}->cancelCompletion: {
    "name": "completionCloseTestView.txt",
    "injects": {
        "name": "name"
    },
    "selectors": [
        {
            "showAtLog<-name": {
                "format": "completion cancelled at [name]"
            }
        }
    ]
}->assertResult: {
    "id": "completion window close",
    "contains": {
        "showAtLog": {
            "output": "completion cancelled at completionCloseTestView.txt"
        }
    },
    "description": "not close."
}


test>存在するファイルのviewに対してselectorを実行する,
viewEmit/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->viewEmit: {
    "identity": "viewEmitToSample.txt",
    "name": "sample.txt",
    "selectors": [
        {
            "showAtLog": {
                "message": "view emit over."
            }
        }
    ]
}->assertResult: {
    "id": "view emit api test",
    "contains": {
        "showAtLog": {
            "output": "view emit over."
        }
    },
    "description": "not match."
}


test>deepなレイヤーのviewEmitで、injectを実施する/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->setViewReactor: {
    "react": "ss_on_selection_modified_by_setselection",
    "injects": {
        "name": "message"
    },
    "reactors": [
        {
            "showAtLog<-message": {
                
            }
        }
    ]
}->viewEmit: {
    "identity": "setSelectionToSample.txt",
    "name": "sample.txt",
    "selectors": [
        {
            "setSelection<-name": {
                "selections": [
                    {
                        "from": 0,
                        "to": 2
                    }
                ]
            }
        }
    ]
}->assertResult: {
    "id": "viewEmit in deep level with API defined injection",
    "contains": {
        "showAtLog": {
            "output": "sample.txt"
        }
    },
    "description": "not match."
}->closeFile: {
    "name": "sample.txt"
}


test>deepなレイヤーのviewEmitを実行する/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->setViewReactor: {
    "react": "ss_on_selection_modified_by_setselection",
    "reactors": [
        {
            "viewEmit<-name": {
                "identity": "deepLayerViewEmit",
                "name": "sample.txt",
                "selectors": [
                    {
                        "showAtLog": {
                            "message": "view emit over in deep nest."
                        }
                    }
                ]
            }
        }
    ]
}->viewEmit: {
    "identity": "setSelectionToSample.txt",
    "name": "sample.txt",
    "selectors": [
        {
            "setSelection<-name": {
                "selections": [
                    {
                        "from": 0,
                        "to": 1
                    }
                ]
            }
        }
    ]
}->assertResult: {
    "id": "viewEmit in deep level",
    "contains": {
        "showAtLog": {
            "output": "view emit over in deep nest."
        }
    },
    "description": "not match."
}->closeFile: {
    "name": "sample.txt"
}


test>そのビューの文字列が増えたら、ss_v_increasedイベントがでる/setViewReactor: {
    "react": "ss_v_increased",
    "reactors": [
        {
            "showAtLog": {
                "message": "increased."
            }
        }
    ]
}->openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->modifyView: {
    "name": "sample.txt",
    "add": "1"
}->closeFile: {
    "name": "sample.txt"
}->assertResult: {
    "id": "ST3: view text increased2",
    "contains": {
        "showAtLog": {
            "output": "increased."
        }
    },
    "description": "not match."
}


test>そのビューの文字列が減ったら、ss_v_decreasedイベントがでる/setViewReactor: {
    "react": "ss_v_decreased",
    "reactors": [
        {
            "showAtLog": {
                "message": "decreased."
            }
        }
    ]
}->openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->modifyView: {
    "name": "sample.txt",
    "add": "1"
}->modifyView: {
    "name": "sample.txt",
    "reduce": 1
}->closeFile: {
    "name": "sample.txt"
}->assertResult: {
    "id": "ST3: view text decreased",
    "contains": {
        "showAtLog": {
            "output": "decreased."
        }
    },
    "description": "not match."
}


test>openFileしてforcelySave/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->forcelySave: {
    "name": "sample.txt",
    "injects": {
        "name": "message"
    },
    "selectors": [
        {
            "showAtLog<-message": {
      
            }
        }
    ]
}->assertResult: {
    "id": "forcelySave with selectors",
    "contains": {
        "showAtLog": {
            "output": "sample.txt"
        }
    },
    "description": "not match."
}->closeFile: {
    "name": "sample.txt"
}


test>getAllFilePathとselectors/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->getAllFilePath: {
    "anchor": "tests.html",
    "limit": 1,
    "selectors": [
        {
            "showAtLog<-paths, fullpaths, basedir": {
                "format": "the [basedir] + [paths] + [fullpaths]"
            }
        }
    ]
}->assertResult: {
    "id": "getAllFilePath with selectors",
    "isnotempty": "showAtLog",
    "description": "not match."
}->closeFile: {
    "name": "sample.txt"    
}


test>basePathを足がかりに特定のファイルが含まれるフォルダより下のすべてのファイルパスを取得する/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->getAllFilePath: {
    "anchor": "sample.txt",
    "limit": 1,
    "selectors": [
        {
            "showAtLog<-paths": {
                "format": "[paths]"
            }
        }
    ]
}->assertResult: {
    "id": "getAllFilePath the path found",
    "isnotempty": "showAtLog",
    "description": "not match."
}->closeFile: {
    "name": "sample.txt"
}


test>countUpとresetCounts/countUp: {
    "label": "testCount3",
    "default": 0
}->countUp: {
    "label": "testCount3",
    "default": 0,
    "selectors": [
        {
            "showAtLog<-count": {
                "format": "one, [count]"
            }
        }
    ]
}->assertResult: {
    "id": "
    . is 1",
    "contains": {
        "showAtLog": {
            "output": "one, 1"
        }
    },
    "description": "not match."
}->resetCounts: {
    "label": "testCount3"
}->countUp: {
    "label": "testCount3",
    "default": -100,
    "selectors": [
        {
            "showAtLog<-count": {
                "format": "two, [count]"
            }
        }
    ]
}->assertResult: {
    "id": "reset count is done. is 0",
    "contains": {
        "showAtLog": {
            "output": "two, -100"
        }
    },
    "description": "not match."
}


test>selectorsと/countUp: {
    "label": "testCount",
    "default": 0,
    "selectors": [
        {
            "showAtLog<-count, label": {
                "format": "[label]:[count]"
            }
        }
    ]
}->assertResult: {
    "id": "count up with selectors",
    "contains": {
        "showAtLog": {
            "output": "testCount:0"
        }
    },
    "description": "not match."
}->resetCounts: {
    
}


test>countUp twice/countUp: {
    "label": "testCount2",
    "default": 0
}->countUp: {
    "label": "testCount2",
    "default": 0,
    "selectors": [
        {
            "showAtLog<-label, count": {
                "format": "[label]:[count]"
            }
        }
    ]
}->assertResult: {
    "id": "count up",
    "contains": {
        "showAtLog": {
            "output": "testCount2:1"
        }
    },
    "description": "not match."
}->resetCounts: {
    
}


test>countUp, reset then countUp/countUp: {
    "label": "testCount2",
    "default": 0
}->countUp: {
    "label": "testCount2",
    "default": 0
}->resetCounts: {
    
}->countUp: {
    "label": "testCount2",
    "default": -1,
    "selectors": [
        {
            "showAtLog<-label, count": {
                "format": "[label]:[count]"
            }
        }
    ]
}->assertResult: {
    "id": "reset count",
    "contains": {
        "showAtLog": {
            "output": "testCount2:-1"
        }
    },
    "description": "not match."
}->resetCounts: {
    
}


test>resetCountsのselectors/countUp: {
    "label": "test",
    "default": -1
}->resetCounts:{
    "injects": {
        "resetted": "theLast"
    },
    "selectors": [    
        {
            "showAtLog<-theLast": {
                "format": "the resetted param is [theLast]"
            }
        }
    ]
}->assertResult: {
    "id": "ST3: resetted labels are here.",
    "contains": {
        "showAtLog": {
            "output": "the resetted param is ['test']"
        }
    },
    "description": "not match."
}->resetCounts: {
    
}


test>setSelectionを連続で発生させて、delayがあるのでタイミング内では一度しか発生しない。/createBuffer: {
    "name": "dummy.txt"
}->ここでのdelayが機能していれば、イベントはdelayされ、countUpが実行されないはず。/setViewReactor: {
    "react": "ss_on_selection_modified_by_setselection",
    "reactors": [
        {
            "countUp": {
                "label": "setSelectionCount",
                "default": 0,
                "selectors": [
                    {
                        "showAtLog<-label, count": {
                            "format": "[label]:[count]"
                        }
                    }
                ]
            }
        }
    ],
    "delay": 100
}->setSelection: {
    "name": "dummy.txt",
    "selections": [
        {
            "from": 0,
            "to": 0
        }
    ]
}->setSelection: {
    "name": "dummy.txt",
    "selections": [
        {
            "from": 0,
            "to": 0
        }
    ]
}->assertResult: {
    "id": "reactor reacts only once",
    "notcontains": {
        "showAtLog": {
            "output": "setSelectionCount:1"
        }
    },
    "description": "not 0."
}->resetCounts: {
    
}


test>setSelectionで選択範囲を作成する/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->setSelection: {
    "name": "sample.txt",
    "selections": [
        {
            "from": 0,
            "to": 1
        }
    ],
    "selectors": [
        {
            "showAtLog<-name, selecteds": {
                "format": "[name]:[selecteds]"
            }
        }
    ]
}->assertResult: {
    "id": "selection generated",
    "contains": {
        "showAtLog": {
            "output": "sample.txt:[[0, 1]]"
        }
    },
    "description": "not match."
}->closeFile: {
    "name": "sample.txt"
}


test>setSelectionでselectedRegionsを引き起こし、selectorに値を引き継ぐ/setViewReactor: {
    "react": "ss_on_selection_modified_by_setselection",
    "reactors": [
        {
            "selectedRegions<-name, selecteds": {
                "isexactly": false,
                "selectors": [
                    {
                        "viewEmit<-name": {
                            "identity": "testTargetId",
                            "selectors": [
                                {
                                    "showAtLog<-body": {
                                        "format": "the '[body]' emitted with parameter"
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]
}->openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->appendRegion: {
    "line": "1",
    "message": "test",
    "name": "sample.txt",
    "condition": "keyword"
}->setSelection: {
    "name": "sample.txt",
    "selections": [
        {
            "from": 0,
            "to": 1
        }
    ]
}->assertResult: {
    "id": "ST3: viewReactor, fire event_showAtLog 2",
    "contains": {
        "showAtLog": {
            "output": "the 'a\nb\nc' emitted with parameter"
        }
    },
    "description": "no showAtLog found."
}->closeFile: {
    "name": "sample.txt"
}


test>setSelectionでたった一つの範囲を作成、イベントヒットからtail位置のselectionを取得する/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample3.txt"
}->setViewReactor: {
    "react": "ss_on_selection_modified_by_setselection",
    "reactors": [
        {
            "transform<-selecteds": {
                "code": "
listOfSelecteds = inputs[\"selecteds\"]\n
output({\"tail\":str(listOfSelecteds[-1])})
                ",
                "selectors": [
                    {
                        "showAtLog<-tail": {
                            "format": "the [tail] is last of selections."
                        }
                    }
                ]
            }
        }
    ]
}->setSelection: {
    "name": "sample3.txt",
    "selections": [
        {
            "from": 10,
            "to": 11
        }
    ]
}->assertResult: {
    "id": "ST3: setSelection generates the result of one selecteds.",
    "contains": {
        "showAtLog": {
            "output": "the (10, 11) is last of selections."
        }
    },
    "description": "not match."
}->closeFile: {
    "name": "sample3.txt"
}


test>setSelectionで2つの範囲を作成、イベントヒットからtail位置のselectionを取得する/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample3.txt"
}->setViewReactor: {
    "react": "ss_on_selection_modified_by_setselection",
    "reactors": [
        {
            "transform<-selecteds": {
                "code": "
listOfSelecteds = inputs[\"selecteds\"]\n
output({\"tail\":str(listOfSelecteds[-1])})
                ",
                "selectors": [
                    {
                        "showAtLog<-tail": {
                            "format": "the [tail] is last of selections."
                        }
                    }
                ]
            }
        }
    ]
}->setSelection: {
    "name": "sample3.txt",
    "selections": [
        {
            "from": 1,
            "to": 2
        },
        {
            "from": 10,
            "to": 11
        }
    ]
}->assertResult: {
    "id": "ST3: setSelection generates the result of one selecteds 2.",
    "contains": {
        "showAtLog": {
            "output": "the (10, 11) is last of selections."
        }
    },
    "description": "not match."
}->closeFile: {
    "name": "sample3.txt"
}


test>setSelectionで2つの範囲を作成、イベントヒットからtail位置のselectionを取得する/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample3.txt"
}->setViewReactor: {
    "react": "ss_on_selection_modified_by_setselection",
    "reactors": [
        {
            "transform<-selecteds": {
                "code": "
listOfSelecteds = inputs[\"selecteds\"]\n
output({\"tail\":str(listOfSelecteds[-1])})
                ",
                "selectors": [
                    {
                        "showAtLog<-tail": {
                            "format": "the [tail] is last of selections."
                        }
                    }
                ]
            }
        }
    ]
}->setSelection: {
    "name": "sample3.txt",
    "selections": [
        {
            "from": 1,
            "to": 2
        },
        {
            "from": 10,
            "to": 11
        },
        {
            "from": 13,
            "to": 15
        }
    ]
}->assertResult: {
    "id": "ST3: setSelection generates the result of one selecteds 3.",
    "contains": {
        "showAtLog": {
            "output": "the (13, 15) is last of selections."
        }
    },
    "description": "not match."
}->closeFile: {
    "name": "sample3.txt"
}


test>setSelectionでselectedRegionsを引き起こす/setViewReactor: {
    "react": "ss_on_selection_modified_by_setselection",
    "reactors": [
        {
            "selectedRegions<-name, selecteds": {
                "isexactly": false,
                "selectors": [
                    {
                        "eventEmit": {
                            "event": "event_showAtLog"
                        }
                    }
                ]
            }
        }
    ]
}->setEventReactor: {
    "react": "event_showAtLog",
    "reactors": [
        {
            "showAtLog": {
                "message": "here comes!!"
            }
        }
    ]
}->openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->appendRegion: {
    "line": "1",
    "message": "test",
    "name": "sample.txt",
    "condition": "keyword"
}->setSelection: {
    "name": "sample.txt",
    "selections": [
        {
            "from": 0,
            "to": 1
        }
    ]
}->assertResult: {
    "id": "ST3: viewReactor, fire event_showAtLog 1",
    "contains": {
        "showAtLog": {
            "output": "here comes!!"
        }
    },
    "description": "no showAtLog found."
}->closeFile: {
    "name": "sample.txt"
}


test>regionの2contentsに対して、setSelectionでselectedRegionsを引き起こし、2件の情報を取得する/setViewReactor: {
    "react": "ss_on_selection_modified_by_setselection",
    "reactors": [
        {
            "selectedRegions<-name, selecteds": {
                "isexactly": false,
                "injects": {
                    "messages": "datas"
                },
                "selectors": [
                    {
                        "showAtLog<-datas": {
                            "format": "the [datas]"
                        }
                    }
                ]
            }
        }
    ]
}->openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->appendRegion: {
    "line": "1",
    "message": "test",
    "name": "sample.txt",
    "condition": "keyword"
}->appendRegion: {
    "line": "1",
    "message": "test2",
    "name": "sample.txt",
    "condition": "keyword"
}->setSelection: {
    "name": "sample.txt",
    "selections": [
        {
            "from": 0,
            "to": 1
        }
    ]
}->順番の正当性が無いので失敗する。/assertResult: {
    "id": "ST3: contains 2 regions and there datas.",
    "contains": {
        "showAtLog": {
            "output": "the ['test2', 'test']"
        }
    },
    "description": "not match."
}->closeFile: {
    "name": "sample.txt"
}


test>selectedRegionsからの値変形チェック/setViewReactor: {
    "react": "ss_on_selection_modified_by_setselection",
    "reactors": [
        {
            "selectedRegions<-name, selecteds": {
                "isexactly": false,
                "selectors": [
                    {
                        "showAtLog<-line, from, to": {
                            "format": "L:[line], ([from], [to])"
                        }
                    }
                ]
            }
        }
    ]
}->openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->appendRegion: {
    "line": "1",
    "message": "test",
    "name": "sample.txt",
    "condition": "keyword"
}->appendRegion: {
    "line": "1",
    "message": "test2",
    "name": "sample.txt",
    "condition": "keyword"
}->setSelection: {
    "name": "sample.txt",
    "selections": [
        {
            "from": 0,
            "to": 1
        }
    ]
}->assertResult: {
    "id": "ST3: parameter injected through selectRegions.",
    "contains": {
        "showAtLog": {
            "output": "L:1, (0, 1)"
        }
    },
    "description": "not match."
}->closeFile: {
    "name": "sample.txt"
}


test>transormの応用例、2件のregionDataをそれぞれToolTipに変形する/setViewReactor: {
    "react": "ss_on_selection_modified_by_setselection",
    "reactors": [
        {
            "selectedRegions<-name, selecteds": {
                "isexactly": false,
                "selectors": [
                    {
                        "transform<-path, crossed": {
                            "transformerpath": "SUBLIMESOCKET_PATH:tests/testResources/containsRegionTargetTransformer.py",
                            "selectors": [
                                {
                                    "showToolTip<-name, onselected, oncancelled": {
                                        
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]
}->openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->一行目のregion/appendRegion: {
    "line": "1",
    "message": "test",
    "name": "sample.txt",
    "condition": "keyword"
}->2行目のregion/appendRegion: {
    "line": "2",
    "message": "test2",
    "name": "sample.txt",
    "condition": "keyword"
}->1行目と2行目のregionを選択/setSelection: {
    "name": "sample.txt",
    "selections": [
        {
            "from": 0,
            "to": 1
        },
        {
            "from": 2,
            "to": 3
        }
    ]
}->assertResult: {
    "id": "ST3: show 2 regions messages in toolTip1. @a",
    "contains": {
        "showAtLog": {
            "output": "here comes a as a daredevil!!"
        }
    },
    "description": "not match."
}->assertResult: {
    "id": "ST3: show 2 regions messages in toolTip2. @b",
    "contains": {
        "showAtLog": {
            "output": "here comes b as a daredevil!!"
        }
    },
    "description": "not match."
}->closeFile: {
    "name": "sample.txt"
}


test>試験的なtransormerの応用例、2件のregionDataをToolTipに変形、内容は空/setViewReactor: {
    "react": "ss_on_selection_modified_by_setselection",
    "reactors": [
        {
            "selectedRegions<-name, selecteds": {
                "selectors": [
                    {
                        "showToolTip<-name, messages": {
                            "transformToToolTip": "messages",
                            "onselected": [
                                {
                                    "sample": [
                                        
                                    ]
                                }
                            ],
                            "oncancelled": [
                                
                            ]
                        }
                    }
                ]
            }
        }
    ]
}->openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->appendRegion: {
    "line": "1",
    "message": "test",
    "name": "sample.txt",
    "condition": "keyword"
}->appendRegion: {
    "line": "1",
    "message": "test2",
    "name": "sample.txt",
    "condition": "keyword"
}->setSelection: {
    "name": "sample.txt",
    "selections": [
        {
            "from": 0,
            "to": 1
        }
    ]
}->assertResult: {
    "id": "show 2 regions messages in toolTip, with empty",
    "notcontains": {
        "showAtLog": {
            "output": "hereComes!"
        }
    },
    "description": "not match."
}->closeFile: {
    "name": "sample.txt"
}


test>setSelectionでselectedRegionsを引き起こし、tooltipへと値を引き継ぐ/setViewReactor: {
    "react": "ss_on_selection_modified_by_setselection",
    "reactors": [
        {
            "selectedRegions<-name, selecteds": {
                "isexactly": false,
                "selectors": [
                    {
                        "showToolTip<-name": {
                            "onselected": [
                                {
                                    "test1": [
                                        {
                                            "transform<-name": {
                                                "code": "
import os\n

message = inputs[\"name\"]\n
output({\"message\":message})\n
                                                ",
                                                "selectors": [
                                                    {
                                                        "showAtLog<-message": {
                                                            
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            ],
                            "oncancelled": [
                                
                            ]
                        }
                    }
                ]
            }
        }
    ]
}->openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->appendRegion: {
    "line": "1",
    "message": "test",
    "name": "sample.txt",
    "condition": "keyword"
}->setSelection: {
    "name": "sample.txt",
    "selections": [
        {
            "from": 0,
            "to": 1
        }
    ]
}->assertResult: {
    "id": "ST3: fire tooltip with inject",
    "contains": {
        "showAtLog": {
            "output": "sample.txt"
        }
    },
    "description": "no showAtLog found."
}->closeFile: {
    "name": "sample.txt"
}


test>setSelectionでselectedRegionsを引き起こそうとするが、regionが無い/setViewReactor: {
    "react": "ss_on_selection_modified_by_setselection",
    "reactors": [
        {
            "selectedRegions<-name, selecteds": {
                "selectors": [
                    {
                        "showAtLog": {
                            "message": "never comes here."
                        }
                    }
                ]
            }
        }
    ]
}->openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->setSelection: {
    "name": "sample.txt",
    "selections": [
        {
            "from": 0,
            "to": 1
        }
    ]
}->assertResult: {
    "id": "no region and no selectors run.",
    "notcontains": {
        "showAtLog": {
            "output": "never comes here."
        }
    },
    "description": "no showAtLog found."
}->closeFile: {
    "name": "sample.txt"
}


test>ツールチップの表示/createBuffer: {
    "name": "showToolTipView.txt"
}->showToolTip: {
    "name": "showToolTipView.txt",
    "onselected": [
        {
            "will show the tooltip": [
                {
                    "showAtLog": {
                        "message": "toolTipContentsButNotFire."
                    }
                }
            ]
        },
        {
            "will show the tooltip2": [
                {
                    "showAtLog": {
                        "message": "toolTipContentsButNotFire."
                    }
                }
            ]
        }
    ],
    "oncancelled": [
        
    ],
    "selectors": [
        {
            "showAtLog<-titles": {
                "format": "[titles]"
            }
        }
    ]
}->assertResult: {
    "id": "ST3: toolTipShouldShow 1",
    "contains": {
        "showAtLog": {
            "output": "['will show the tooltip', 'will show the tooltip2']"
        }
    },
    "description": "not match."
}


test>ツールチップの表示2/createBuffer: {
    "name": "showToolTipView.txt"
}->showToolTip: {
    "name": "showToolTipView.txt",
    "onselected": [
        {
            "will show the tooltip": [
                {
                    "showAtLog": {
                        "message": "toolTipContentsButNotFire."
                    }
                }
            ]
        },
        {
            "will show the tooltip2": [
                {
                    "showAtLog": {
                        "message": "toolTipContentsButNotFire."
                    }
                }
            ]
        }
    ],
    "oncancelled": [
        
    ],
    "selectors": [
        {
            "showAtLog<-titles": {
                "format": "[titles]"
            }
        }
    ]
}->assertResult: {
    "id": "ST3: toolTipShouldShow 2",
    "contains": {
        "showAtLog": {
            "output": "['will show the tooltip', 'will show the tooltip2']"
        }
    },
    "description": "not match."
}


test>ツールチップの選択、一択を選ぶ/createBuffer: {
    "name": "selectToolTip.txt"
}->showToolTip: {
    "name": "selectToolTip.txt",
    "onselected": [
        {
            "showAtLogItem": [
                {
                    "showAtLog": {
                        "message": "hereComes choice 1"
                    }
                }
            ]
        }
    ],
    "oncancelled": [
        
    ]
}->assertResult: {
    "id": "ST3: choiceTheHead",
    "contains": {
        "showAtLog": {
            "output": "hereComes choice 1"
        }
    },
    "description": "not match."
}


test>onselected項目がない場合、効果無しなので表示しない。/createBuffer: {
    "name": "selectToolTip.txt"
}->showToolTip: {
    "name": "selectToolTip.txt",
    "onselected": [
        
    ],
    "oncancelled": [
        {
            "showAtLog": {
                "message": "no choice."
            }
        }
    ],
    "selectors": [
        {
            "showAtLog<-titles": {
                "format": "[titles]"
            }
        }
    ]
}->assertResult: {
    "id": "no coice on toolTip",
    "notcontains": {
        "showAtLog": {
            "output": "[]"
        }
    },
    "description": "not match."
}


test>ツールチップの選択後、inject済のviewを使ってappendRegionする/createBuffer: {
    "name": "selectToolTip.txt"
}->showToolTip: {
    "name": "selectToolTip.txt",
    "onselected": [
        {
            "add region": [
                {
                    "appendRegion<-name": {
                        "line": "1",
                        "message": "test",
                        "condition": "keyword",
                        "selectors": [
                            {
                                "showAtLog<-identity, condition, line, from, to, message": {
                                    "format": "[identity], [condition], [line], [from], [to], [message]"
                                }
                            }
                        ]
                    }
                }
            ]
        }
    ],
    "oncancelled": [
        
    ]
}->assertResult: {
    "id": "ST3: choice and add region to buffer.",
    "contains": {
        "showAtLog": {
            "output": "ss_(0, 0), keyword, 1, 0, 0, test"
        }
    },
    "description": "not match."
}


test>ツールチップ選択orキャンセル後、最終的に動作するfinallyな仕掛け/createBuffer: {
    "name": "onFinally.txt"
}->showToolTip: {
    "name": "onFinally.txt",
    "onselected": [
        {
            "name": [
                {
                    "showAtLog": {
                        "message": "hit."
                    }
                }
            ]
        }
    ],
    "oncancelled": [
        
    ],
    "finally": [
        {
            "showAtLog": {
                "message": "finally."
            }
        }
    ]
}->assertResult: {
    "id": "ST3: finally will run",
    "contains": {
        "showAtLog": {
            "output": "finally."
        }
    },
    "description": "not match."
}


test>setSelectionとselectors/createBuffer: {
    "name": "setSelectionWithSelectors.txt"
}->setSelection: {
    "name": "setSelectionWithSelectors.txt",
    "selections": [
        {
            "from": 0,
            "to": 1
        }
    ],
    "selectors": [
        {
            "showAtLog<-selecteds, path": {
                "format": "[selecteds] are in the [path]"
            }
        }
    ]
}->assertResult: {
    "id": "setSelection with selectors",
    "contains": {
        "showAtLog": {
            "output": "[[0, 1]] are in the setSelectionWithSelectors.txt"
        }
    },
    "description": "not match."
}


test>clearSelectionとselectors/createBuffer: {
    "name": "clearSelection.txt"
}->setSelection: {
    "name": "clearSelection.txt",
    "selections": [
        {
            "from": 0,
            "to": 1
        }
    ]
}->clearSelection: {
    "name": "clearSelection.txt",
    "selectors": [
        {
            "showAtLog<-name, cleards": {
                "format": "[name] + [cleards]."
            }
        }
    ]
}->assertResult: {
    "id": "ST3: clearSelection with selectors",
    "contains": {
        "showAtLog": {
            "output": "clearSelection.txt + [{(0, 1): ''}]."
        }
    },
    "description": "not match."
}


test>選択範囲を解消する/createBuffer: {
    "name": "clearSelection.txt"
}->setSelection: {
    "name": "clearSelection.txt",
    "selections": [
        {
            "from": 0,
            "to": 1
        }
    ]
}->clearSelection: {
    "name": "clearSelection.txt",
    "selectors": [
        {
            "showAtLog<-path, name, cleards": {
                "format": "path, name, cleards"
            }
        }
    ]
}->assertResult: {
    "id": "clear the selection ",
    "isnotempty": "showAtLog",
    "description": "not match."
}


test>ファイルを閉じる/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->closeFile: {
    "name": "sample.txt",
    "injects": {
        "name": "message"
    },
    "selectors": [
        {
            "showAtLog<-message": {}
        }
    ]
}->assertResult: {
    "id": "close file with selector",
    "contains": {
        "showAtLog": {
            "output": "sample.txt"
        }
    },
    "description": "not match."
}


test>collectしたviewに対してselectors/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->collectViews: {
    "injects": {
        "collecteds": "message"
    },
    "selectors": [
        {
            "showAtLog<-message": {

            }
        }
    ]
}->assertResult: {
    "id": "collectViews with selectors",
    "isnotempty": "showAtLog",
    "description": "not match."
}


test>現在開いているviewを集める。一つ以上のファイルパスがあるはず/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->collectViews: {
    "selectors": [
        {
            "showAtLog<-collecteds": {
                "format": "[collecteds]"
            }
        }
    ]
}->assertResult: {
    "id": "exist file's views is here.",
    "isnotempty": "showAtLog",
    "description": "not match."
}->closeFile: {
    "name": "sample.txt"
}


test>noViewFoundを起こし、log出力をassertする/setEventReactor: {
    "react": "ss_f_noViewFound",
    "reactors": [
        {
            "showAtLog<-name": {
                "format": "view [name] not found."
            }
        }
    ]
}->appendRegion: {
    "line": "1",
    "message": "test",
    "name": "exactlynotopenedfile.txt",
    "condition": "keyword"
}->assertResult: {
    "id": "no view found raise",
    "contains": {
        "showAtLog": {
            "output": "view exactlynotopenedfile.txt not found."
        }
    },
    "description": "not match."
}


test>SublimeSocketとしての現在のbasePathを指定する/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->setSublimeSocketWindowBasePath: {
    "selectors": [
        {
            "showAtLog<-basename": {
                "format": "[basename]"
            }
        }
    ]
}->assertResult: {
    "id": "ST3: set basePath",
    "contains": {
        "showAtLog": {
            "output": "sample.txt"
        }
    },
    "description": "not match"
}->closeFile: {
    "name": "sample.txt"
}


test>createBuffer: {
    "name": "bufferForSelectors.txt",
    "injects": {
        "name": "message"
    },
    "selectors": [
        {
            "showAtLog<-message": {

            }
        }
    ]
}->assertResult: {
    "id": "createBuffer with selectors",
    "contains": {
        "showAtLog": {
            "output": "bufferForSelectors.txt"
        }
    },
    "description": "not match."
}


test>delayのチェック。イベントを2件発生させ、delayによって先行したものだけを実行させる/createBuffer: {
    "name": "delayTarget.txt"
}->viewEmit: {
    "identity": "delay",
    "name": "delayTarget.txt",
    "delay": 100,
    "selectors": [
        {
            "showAtLog": {
                "message": "delay1"
            }
        }
    ]
}->viewEmit: {
    "identity": "delay",
    "name": "delayTarget.txt",
    "delay": 100,
    "selectors": [
        {
            "showAtLog": {
                "message": "delay2"
            }
        }
    ]
}->assertResult: {
    "id": "only one log by delay-1",
    "contains": {
        "showAtLog": {
            "output": "delay1"
        }
    },
    "description": "not exist"
}->assertResult: {
    "id": "only one log by delay-2",
    "notcontains": {
        "showAtLog": {
            "output": "delay2"
        }
    },
    "description": "exist"
}


test>現在開いているファイルに対するviewEmitのテスト。特定のバッファを開いておいて、viewEmit発効/createBuffer: {
    "name": "viewEmit.txt"
}->viewEmit: {
    "identity": "theViewEmit",
    "name": "viewEmit.txt",
    "delay": 100,
    "selectors": [
        {
            "showAtLog<-path, rowcol, body": {
                "message": "dummy",
                "format": "p:[path], r:[rowcol], b:[body]."
            }
        }
    ]
}->assertResult: {
    "id": "viewEmit!",
    "contains": {
        "showAtLog": {
            "output": "p:viewEmit.txt, r:0,0, b:."
        }
    },
    "description": "not match."
}


test>eventEmitでのInjects機構のテスト/setEventReactor: {
    "react": "event_accept_params",
    "reactors": [
        {
            "showAtLog": {
                "message": "hereComes"
            }
        },
        {
            "showAtLog<-messageFromEventEmit": {
                "format": "from [messageFromEventEmit]"
            }
        }
    ]
}->eventEmit: {
    "event": "event_accept_params",
    "messageFromEventEmit": "the message via eventEmit"
}->assertResult: {
    "id": "eventEmit with injects",
    "contains": {
        "showAtLog": {
            "output": "from the message via eventEmit"
        }
    },
    "description": "not match."
}


test>eventEmitでselectors/eventEmit: {
    "event": "event_testSelectors",
    "selectors": [
        {
            "showAtLog<-event": {
                "format": "the [event]"
            }
        }
    ]
}->assertResult: {
    "id": "eventEmit with selectors",
    "contains": {
        "showAtLog": {
            "output": "the event_testSelectors"
        }
    },
    "description": "not match."
}


test>eventEmitのテスト/setEventReactor: {
    "react": "event_EmitTestEvent",
    "reactors": [
        {
            "showAtLog": {
                "message": "testing for eventEmit"
            }
        }
    ]
}->eventEmit: {
    "event": "event_EmitTestEvent"
}->assertResult: {
    "id": "eventEmit has emitted result",
    "contains": {
        "showAtLog": {
            "output": "testing for eventEmit"
        }
    },
    "description": "not match"
}


test>特定のviewに対するreactorのテスト。/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt"
}->setViewReactor: {
    "react": "on_close",
    "reactors": [
        {
           "showAtLog<-name": {
                "format": "name is [name]"
            }
        }
    ]
}->このイベントでcloseイベントを発生させる/closeFile: {
    "name": "sample.txt"
}->assertResult: {
    "id": "ST3: close then run viewEmit to specific file",
    "contains": {
        "showAtLog": {
            "output": "name is sample.txt"
        }
    },
    "description": "not match."
}


test>Notifyを表示する/notify: {
    "title": "test_notify",
    "message": "notice!",
    "selectors": [
        {
            "showAtLog<-title, message": {
                "format": "[title], [message]"
            }
        }
    ]
}->assertResult: {
    "id": "show notification",
    "contains": {
        "showAtLog": {
            "output": "test_notify, notice!"
        }
    },
    "description": "not match."
}


test>シェルを実行する/runShell: {
    "main": "pwd",
    "debug": true
}->assertResult: {
    "id": "ruh shell",
    "contains": {
        "showAtLog": {
            "output": "pwd"
        }
    },
    "description": "not match."
}


test>ステータスバーにメッセージを表示/showStatusMessage: {
    "message": "testStatusMessage",
    "debug": true
}->assertResult: {
    "id": "show statusMessage",
    "contains": {
        "showAtLog": {
            "output": "testStatusMessage"
        }
    },
    "description": "status message not match."
}


test>ログ出力のテスト/showAtLog: {
    "message": "testLogMessage"
}->assertResult: {
    "id": "log output test",
    "contains": {
        "showAtLog": {
            "output": "testLogMessage"
        }
    },
    "description": "not match."
}


test>フォーマット付きログ出力のテスト/showAtLog: {
    "message": "testLogMessage",
    "format": "[formatted] [log]",
    "formatted": "works",
    "log": "fine."
}->assertResult: {
    "id": "log output test",
    "contains": {
        "showAtLog": {
            "output": "works fine."
        }
    },
    "description": "not match."
}


test>フィルタ定義を行い、フィルタが生成されている/defineFilter: {
    "name": "testFilter",
    "filters": [
        {
            "testPattern": {
                "selectors": [
                    {
                        "showStatusMessage": {
                            "message": "hello!"
                        }
                    }
                ]
            }
        }
    ],
    "selectors": [
        {
            "showAtLog<-name, patterns": {
                "format": "[name], [patterns]"
            }
        }
    ]
}->assertResult: {
    "id": "ST3: should have filter-info",
    "contains": {
        "showAtLog": {
            "output": "testFilter, ['testPattern']"
        }
    },
    "description": "not match."
}


test>filteringのテスト。フィルタをセット、改行指定ありで、結果に特定のデータが入る/defineFilter: {
    "name": "filter_13/12/04 18:16:49",
    "filters": [
        {
            "(.*)dummyline": {
                "selectors": [
                    {
                        "showAtLog<-groups[0], source": {
                            "format": "should be 1/2:[groups[0]] in [source]/."
                        }
                    }
                ],
                "dotall": true
            }
        }
    ]
}->filtering: {
    "name": "filter_13/12/04 18:16:49",
    "source": "1\\n2 dummyline",
    "debug": true
}->assertResult: {
    "id": "filter hit values",
    "contains": {
        "showAtLog": {
            "output": "should be 1/2:1\\n2  in 1\\n2 dummyline/."
        }
    },
    "description": "not match."
}


test>filteringのテスト。フィルタをセット、改行指定無しで、結果に特定のデータが入らない/defineFilter: {
    "name": "filter_13/12/04 23:58:49",
    "filters": [
        {
            "(.*)dummyline": {
                "selectors": [
                    {
                        "showAtLog<-groups[0], source": {
                            "format": "should be 1/2:[groups[0]] in [source]/."
                        }
                    }
                ]
            }
        }
    ],
    "dotall": false
}->filtering: {
    "name": "filter_13/12/04 23:58:49",
    "source": "1\\n2 dummyline"
}->assertResult: {
    "id": "filter not hit values",
    "notcontains": {
        "showAtLog": {
            "output": "should be 1/2:1\n2  in 1\n2 dummyline/."
        }
    },
    "description": "but match, should not match"
}


test>filterのパターンを試す/defineFilter: {
    "name": "testDotAll",
    "filters": [
        {
            "^.*?NullReferenceException: (.*?)\n.*? in (.*?):([0-9].*?) \n.*?": {
                "selectors": [
                    {
                        "showAtLog<-groups[0], groups[1], groups[2]": {
                            "format": "[groups[0]] [groups[1]]:[groups[2]]"
                        }
                    }
                ],
                "dotall": true
            }
        }
    ]
}->filtering: {
    "name": "testDotAll",
    "source": "System.NullReferenceException: reason\n  at dummy in place:100 \n  at dummy2 in place2:200 \ndummy3"
}->assertResult: {
    "id": "testDotAll1",
    "contains": {
        "showAtLog": {
            "output": "reason place:100"
        }
    },
    "description": "not match 1."
}->filtering: {
    "name": "testDotAll",
    "source": "System.NullReferenceException: reason2\nsomething\n  at dummy2 in place2:200 \n  at dummy3 in place3:300 \ndummy4"
}->assertResult: {
    "id": "testDotAll2",
    "contains": {
        "showAtLog": {
            "output": "reason2 place2:200"
        }
    },
    "description": "not match 2."
}->filtering: {
    "name": "testDotAll",
    "source": "System.NullReferenceException: reason3\nsomething\nsomething\n  at dummy3 in place3:300 \n  at dummy4 in place4:400 \ndummy5"
}->assertResult: {
    "id": "testDotAll3",
    "contains": {
        "showAtLog": {
            "output": "reason3 place3:300"
        }
    },
    "description": "not match 3."
}->filtering: {
    "name": "testDotAll",
    "source": "NullReferenceException: reason4\nsomething\nsomething\n  at dummy4 in place4:400 \n  at dummy5 in place5:500 \ndummy6"
}->assertResult: {
    "id": "testDotAll4",
    "contains": {
        "showAtLog": {
            "output": "reason4 place4:400"
        }
    },
    "description": "not match 4."
}


test>Clientのidentityを変更する/changeIdentity: {
    "from": "sublimesockettest",
    "to": "test",
    "injects": {
        "from": "from",
        "to": "to"
    },
    "selectors": [
        {
            "showAtLog<-from, to": {
                "format": "[from] becomes [to]."
            }
        }
    ]
}->assertResult: {
    "id": "changeIdentity with selectors",
    "contains": {
        "showAtLog": {
            "output": "sublimesockettest becomes test."
        }
    },
    "description": "not match"
}->changeIdentity: {
    "from": "test",
    "to": "sublimesockettest"
}


test>Clientのidentityを変更する/changeIdentity: {
    "from": "sublimesockettest",
    "to": "test",
    "selectors": [
        {
            "showAtLog<-from, to": {
                "format": "[from], [to]"
            }
        }
    ]
}->assertResult: {
    "id": "changeIdentity done in test",
    "contains": {
        "showAtLog": {
            "output": "sublimesockettest, test"
        }
    },
    "description": "not match"
}->changeIdentity: {
    "from": "test",
    "to": "sublimesockettest"
}


test>ファイル内容を特定クライアントに配信する。/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample4.txt"
}->viewEmit: {
    "identity": "send body of file through monocast",
    "name": "sample4.txt",
    "injects": {
        "body": "message"
    },
    "selectors": [
        {
            "showAtLog<-body": {
                "format": "the [body]"
            }
        },
        {
            "monocastMessage<-message": {
                "target": "sublimesockettest",
                "injects": {
                    "message": "body"
                },
                "selectors": [
                    {
                        "showAtLog<-target, body": {
                            "format": "[target], [body]"
                        }
                    }
                ]
            }
        }
    ]
}->assertResult: {
    "id": "monocast message for specific client",
    "contains": {
        "showAtLog": {
            "output": "the a\nb\n\/\/comment\nc\nd\n\n\ne\nf\n\ng"
        }
    },
    "description": "faild to monocast 1."
}->assertResult: {
    "id": "monocast message for specific client",
    "contains": {
        "showAtLog": {
            "output": "sublimesockettest, a\nb\n\/\/comment\nc\nd\n\n\ne\nf\n\ng"
        }
    },
    "description": "faild to monocast 2."
}->closeFile: {
    "name": "sample4.txt"
}


test>メッセージを特定クライアントに配信する。/monocastMessage: {
    "target": "sublimesockettest",
    "message": "monocasting",
    "injects": {
        "message": "body"
    },
    "selectors": [
        {
            "showAtLog<-target, body": {
                "format": "[target], [body]"
            }
        }
    ]
}->assertResult: {
    "id": "monocast message for specific client",
    "contains": {
        "showAtLog": {
            "output": "sublimesockettest, monocasting"
        }
    },
    "description": "faild to monocast."
}


test>フォーマットを使用したmonocast/monocastMessage: {
    "target": "sublimesockettest",
    "format": "[0]:[a1] [b1] [c1] [d1]",
    "0": "header",
    "a1": "the",
    "b1": "test",
    "c1": "is",
    "d1": "over",
    "injects": {
        "message": "body"
    },
    "selectors": [
        {
            "showAtLog<-target, body": {
                "format": "[target], [body]"
            }
        }
    ]
}->assertResult: {
    "id": "monocast message with format",
    "contains": {
        "showAtLog": {
            "output": "sublimesockettest, header:the test is over"
        }
    },
    "description": "faild to monocast with format."
}


test>対象のいないmonocastMessage/monocastMessage: {
    "target": "noTarget",
    "message": "no one receive this.",
    "injects": {
        "message": "body"
    },
    "selectors": [
        {
            "showAtLog<-target, body": {
                "format": "[target], [body]"
            }
        }
    ]
}->assertResult: {
    "id": "no one receive this message",
    "notcontains": {
        "showAtLog": {
            "output": "no one receive this., "
        }
    },
    "description": "not match."
}


test>メッセージを全クライアントに配信する/broadcastMessage: {
    "message": "broadcasting",
    "selectors": [
        {
            "showAtLog<-targets, message": {
                "format": "[targets], [message]"
            }
        }
    ]
}->assertResult: {
    "id": "ST3: broadcast message for every client",
    "contains": {
        "showAtLog": {
            "output": "[['sublimesockettest']], broadcasting"
        }
    },
    "description": "faild to broadcast."
}


test>reactorをリセットする/resetReactors: {
    "injects": {
        "deleteds": "message"
    },
    "selectors": [
        {
            "showAtLog<-message": {}
        }
    ]
}->assertResult: {
    "id": "reset all reactors",
    "contains": {
        "showAtLog": {
            "output": []
        }
    },
    "description": "not match"
}


test>適当なreactorをセットしたあと、reactorをリセットする/setViewReactor: {
    "react": "on_post_save",
    "reactors": []
}->resetReactors: {
    "injects": {
        "deleteds": "message"
    },
    "selectors": [
        {
            "showAtLog<-message": {}
        }
    ]
}->assertResult: {
    "id": "reset all reactors 2",
    "contains": {
        "showAtLog": {
            "output": ["on_post_save"]
        }
    },
    "description": "not match"
}


test>空のreactorをリセットする/resetReactors: {
    "selectors": [
        {
            "showAtLog<-deleteds": {
                "format": "the [deleteds]"
            }
        }
    ]
}->assertResult: {
    "id": "reset all reactors3",
    "contains": {
        "showAtLog": {
            "output": "the []"
        }
    },
    "description": "not match"
}


test>reactorをセットする/setEventReactor: {
    "react": "event_testEvent",
    "delay": 100,
    "reactors": [
        {
            "showStatusMessage": {
                "message": "eventEmit over."
            }
        }
    ],
    "selectors": [
        {
            "showAtLog<-react, delay": {
                "format": "[react], [delay]"
            }
        }
    ]
}->assertResult: {
    "id": "reactor is set1",
    "contains": {
        "showAtLog": {
            "output": "event_testEvent, 100"
        }
    },
    "description": "not match"
}


test>delayが存在するsetEventReactorを実行、即時実行される/setEventReactor: {
    "react": "event_runImmediate",
    "delay": 100,
    "reactors": [
        {
            "showAtLog": {
                "message": "run before delay"
            }
        }
    ]
}->eventEmit: {
    "event": "event_runImmediate"
}->assertResult: {
    "id": "run once",
    "contains": {
        "showAtLog": {
            "output": "run before delay"
        }
    },
    "description": "not yet run."
}


test>複数件の同名のevent-targetreactorをセットして、上書きされる。/resetReactors: {
    
}->setEventReactor: {
    "react": "event_testEvent",
    "delay": 100,
    "reactors": [
        {
            "showAtLog": {
                "message": "eventEmit over."
            }
        }
    ]
}->setEventReactor: {
    "react": "event_testEvent",
    "delay": 100,
    "reactors": [
        {
            "showAtLog": {
                "message": "eventEmit over.2"
            }
        }
    ]
}->eventEmit: {
    "event": "event_testEvent"
}->assertResult: {
    "id": "reactor is set part2-1",
    "notcontains": {
        "showAtLog": {
            "output": "eventEmit over."
        }
    },
    "description": "not match. 1"
}->assertResult: {
    "id": "reactor is set part2-2",
    "contains": {
        "showAtLog": {
            "output": "eventEmit over.2"
        }
    },
    "description": "not match. 2"
}


test>設定の実行が実行されきったかどうか 1 path版/runSushiJSON: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample_SushiJSON.txt",
    "selectors": [
        {
            "showAtLog<-logs": {
                "format": "runSetting logs:[logs]"
            }
        }
    ]
}->assertResult: {
    "id": "ST3: setting done",
    "contains": {
        "showAtLog": {
            "output": "runSetting logs:['done.']"
        }
    },
    "description": "not match"
}


test>設定の実行が実行されきったかどうか 2 data版/runSushiJSON: {
    "data": "showAtLog:{\"message\":\"done with data.\"}",
    "selectors": [
        {
            "showAtLog<-logs": {
                "format": "runSetting logs:[logs]"
            }
        }
    ]
}->assertResult: {
    "id": "ST3: setting done2",
    "contains": {
        "showAtLog": {
            "output": "runSetting logs:['done with data.']"
        }
    },
    "description": "not match"
}


test>適当な名前のファイルを開き、region追加、selectorsを発動/createBuffer: {
    "name": "currentViewAppendRegion.txt"
}->appendRegion: {
    "line": "1",
    "message": "test",
    "condition": "keyword",
    "name": "currentViewAppendRegion.txt",
    "selectors": [
        {
            "showAtLog<-line, message, from, to, identity, path": {
                "format": "[line] + [message] + [from] + [to] + [identity] + [path]"
            }
        }
    ]
}->assertResult: {
    "id": "appendRegion with selectors",
    "contains": {
        "showAtLog": {
            "output": "1 + test + 0 + 0 + ss_(0, 0) + currentViewAppendRegion.txt"
        }
    },
    "description": "not match."
}


test>適当な名前のバッファを開き、その名前をフル指定し、regionを追加する/createBuffer: {
    "name": "currentViewAppendRegionTest.txt"
}->appendRegion: {
    "line": "1",
    "message": "test",
    "condition": "keyword",
    "name": "currentViewAppendRegionTest.txt",
    "selectors": [
        {
            "showAtLog": {
                "message": "done"
            }
        }
    ]
}->assertResult: {
    "id": "add region to current file",
    "contains": {
        "showAtLog": {
            "output": "done"
        }
    },
    "description": "not match."
}


test>適当な名前のファイルを開き、regionを追加する。regionを加えたいpathの部分マッチ。/createBuffer: {
    "name": "notexistfile.txt"
}->appendRegion: {
    "line": "1",
    "message": "test",
    "name": "testResources/notexistfile.txt",
    "condition": "keyword",
    "selectors": [
        {
            "showAtLog": {
                "message": "done"
            }
        }
    ]
}->assertResult: {
    "id": "contains region result2",
    "contains": {
        "showAtLog": {
            "output": "done"
        }
    },
    "description": "not match."
}


test>適当な名前のファイルを開き、regionを追加する。pathの全部分マッチ。/createBuffer: {
    "name": "notexistfile.txt"
}->appendRegion: {
    "line": "1",
    "message": "test",
    "name": "SUBLIMESOCKET_PATH:tests/testResources/notexistfile.txt",
    "condition": "keyword",
    "selectors": [
        {
            "showAtLog": {
                "message": "done"
            }
        }
    ]
}->assertResult: {
    "id": "contains region result3",
    "contains": {
        "showAtLog": {
            "output": "done"
        }
    },
    "description": "not match."
}


test>適当な名前のファイルを開き、regionの追加に失敗(noViewFoundを起こす)/createBuffer: {
    "name": "notexistfile.txt"
}->appendRegion: {
    "line": "1",
    "message": "test",
    "name": "exactlynotopenedfile.txt",
    "condition": "keyword",
    "selectors": [
        {
            "showAtLog": {
                "message": "should not done."
            }
        }
    ]
}->assertResult: {
    "id": "contains region result4",
    "notcontains": {
        "showAtLog": {
            "output": "should not done."
        }
    },
    "description": "not match."
}


test>eraseAllRegionsでselectors/createBuffer: {
    "name": "eraseAllRegionsWithSelectors.txt"
}->appendRegion: {
    "line": "1",
    "message": "test",
    "condition": "keyword",
    "name": "eraseAllRegionsWithSelectors.txt"
}->eraseAllRegions: {
    "injects": {
        "deletes": "message"
    },
    "selectors": [
        {
            "showAtLog<-message": {}
        }
    ]
}->assertResult: {
    "id": "ST3: eraseAllRegions with selectors.",
    "contains": {
        "showAtLog": {
            "output": {
                "eraseAllRegionsWithSelectors.txt": ["ss_(0, 0)"]
            }
        }
    },
    "description": "not match."
}


test>eraseAllRegionsのテスト。複数のファイルを開き、各1つのregionを追加、消す/createBuffer: {
    "name": "notexistfileA.txt"
}->appendRegion: {
    "line": "1",
    "message": "test",
    "condition": "keyword",
    "name": "notexistfileA.txt"
}->createBuffer: {
    "name": "notexistfileB.txt"
}->appendRegion: {
    "line": "1",
    "message": "test",
    "condition": "keyword",
    "name": "notexistfileB.txt"
}->eraseAllRegions: {
    "selectors": [
        {
            "transform<-deletes":{
                "code": "
deletes = inputs[\"deletes\"]\n
part1 = deletes[\"notexistfileA.txt\"]\n
part2 = deletes[\"notexistfileB.txt\"]\n
output({\"part1\":part1, \"part2\":part2})
                ",
                "selectors": [
                    {
                        "showAtLog<-part1, part2": {
                            "format": "[part1], [part2]"
                        }
                    }
                ]
            }
        }
    ]
}->assertResult: {
    "id": "ST3: eraseAllRegions, two file and each 1 regions will become empty",
    "contains": {
        "showAtLog": {
            "output": "['ss_(0, 0)'], ['ss_(0, 0)']"
        }
    },
    "description": "not all is empty."
}


test>eraseのテスト、存在しない特定のviewのregionすべてを削除する。/createBuffer: {
    "name": "notexistFileC.txt"
}->appendRegion: {
    "line": "1",
    "message": "test",
    "condition": "keyword",
    "name": "notexistFileC.txt"
}->appendRegion: {
    "line": "1",
    "message": "test",
    "condition": "keyword",
    "name": "notexistFileC.txt"
}->eraseAllRegions: {
    "name": "notexistFileC.txt",
    "selectors": [
        {
            "showAtLog<-deletes": {
                "format": "[deletes]"
            }
        }
    ]
}->assertResult: {
    "id": "erase specific view regions",
    "contains": {
        "showAtLog": {
            "output": "{'notexistFileC.txt': ['ss_(0, 0)']}"
        }
    },
    "description": "empty."
}


test>eraseのテスト、存在しないファイルのregionを消す/eraseAllRegions: {
    "name": "notExistFile.txt",
    "selectors": [
        {
            "showAtLog<-deletes": {
                "format": "[deletes]"
            }
        }
    ]
}->assertResult: {
    "id": "eraseAllRegions against not exist target. nothing happens",
    "contains": {
        "showAtLog": {
            "output": "{}"
        }
    },
    "description": "not match."
}


test>eraseのテスト、直前に閉じられて存在しないファイルのregionを削除しようとして、何も起こらない。/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample3.txt"
}->appendRegion: {
    "line": "1",
    "message": "test",
    "condition": "keyword",
    "name": "someBuffer.txt"
}->closeFile: {
    "name": "sample3.txt"
}->eraseAllRegions: {
    "selectors": [
        {
            "showAtLog<-deletes": {
                "format": "[deletes]"
            }
        }
    ]
}->assertResult: {
    "id": "ST3: open, append region, close file then eraseAllRegions. nothing includes",
    "contains": {
        "showAtLog": {
            "output": "{}"
        }
    },
    "description": "not match."
}


test>eraseのテスト、直前に閉じられて存在しないバッファのregionを削除しようとして、何も起こらない。/createBuffer: {
    "name": "someBuffer.txt"
}->appendRegion: {
    "line": "1",
    "message": "test",
    "condition": "keyword",
    "name": "someBuffer.txt"
}->closeAllBuffer: {

}->eraseAllRegions: {
    "selectors": [
        {
            "showAtLog<-deletes": {
                "format": "[deletes]"
            }
        }
    ]
}->assertResult: {
    "id": "ST3: create, append region, close file then eraseAllRegions. nothing includes",
    "contains": {
        "showAtLog": {
            "output": "{}"
        }
    },
    "description": "not match."
}


test>バージョンの出力/versionVerify: {
    "socketVersion": 3,
    "apiVersion": "1.-1.0",
    "injects": {
        "code": "code",
        "message": "theMessage"
    },
    "selectors": [
        {
            "showAtLog<-code, theMessage": {
                "format": "[code] [theMessage]"
            }
        }
    ]
}->assertResult: {
    "id": "code and message will enable.",
    "contains": {
        "showAtLog": {
            "output": "2 VERIFIED/CLIENT_UPDATE: The current running SublimeSocket api version = 1.4.2, this client requires api version = 1.-1.0, please update this client if possible."
        }
    },
    "description": "not match."
}


test>バージョンの精査、apiVersionmajorが一致、minorが低いのでクライアントのUpdateを勧められる+突破/versionVerify: {
    "socketVersion": 3,
    "apiVersion": "1.-1.0",
    "injects": {
        "message": "reason"
    },
    "selectors": [
        {
            "showAtLog<-code, reason": {
                "format": "[code], [reason]"
            }
        }
    ]
}->assertResult: {
    "id": "situation-please update possible",
    "contains": {
        "showAtLog": {
            "output": "2, VERIFIED/CLIENT_UPDATE: The current running SublimeSocket api version = 1.4.2, this client requires api version = 1.-1.0, please update this client if possible."
        }
    },
    "description": "not match."
}


test>バージョンの精査、apiVersionmajorが一致、minorが一致、verifyの突破/versionVerify: {
    "socketVersion": 3,
    "apiVersion": "1.4.2",
    "injects": {
        "message": "reason"
    },
    "selectors": [
        {
            "showAtLog<-code, reason": {
                "format": "[code], [reason]"
            }
        }
    ]
}->assertResult: {
    "id": "situation-latest version",
    "contains": {
        "showAtLog": {
            "output": "1, VERIFIED:\tThe current running SublimeSocket api version = 1.4.2, SublimeSocket 3"
        }
    },
    "description": "not match."
}


test>バージョンの精査、apiVersionmajorが一致、minorが高いので、SSをupdateするアドレスを渡して切断される。/versionVerify: {
    "socketVersion": 3,
    "apiVersion": "1.100.0",
    "dryrun": true,
    "injects": {
        "message": "reason"
    },
    "selectors": [
        {
            "showAtLog<-code, reason": {
                "format": "[code], [reason]"
            }
        }
    ]
}->assertResult: {
    "id": "situation-should update ss",
    "contains": {
        "showAtLog": {
            "output": "-1, REFUSED/SUBLIMESOCKET_UPDATE:\tThe current running SublimeSocket api version = 1.4.2, this is out of date. please update SublimeSocket. this client requires SublimeSocket 1.100.0, see https:\/\/github.com\/sassembla\/SublimeSocket"
        }
    },
    "description": "not match."
}


test>バージョンの精査、apiVersionmajorが低いので、クライアント側へとupdateを求めるシグナル+切断/versionVerify: {
    "socketVersion": 3,
    "apiVersion": "0.0.0",
    "dryrun": true,
    "injects": {
        "message": "reason"
    },
    "selectors": [
        {
            "showAtLog<-code, reason": {
                "format": "[code], [reason]"
            }
        }
    ]
}->assertResult: {
    "id": "situation-should update client",
    "contains": {
        "showAtLog": {
            "output": "-2, REFUSED/CLIENT_UPDATE:\tThe current running SublimeSocket api version = 1.4.2, this client requires api version = 0.0.0, required api version is too old. please update this client."
        }
    },
    "description": "not match."
}


test>バージョンの精査、apiVersionmajorが高いので、SSをupdateするアドレスを渡して切断/versionVerify: {
    "socketVersion": 3,
    "apiVersion": "2.0.0",
    "dryrun": true,
    "injects": {
        "message": "reason"
    },
    "selectors": [
        {
            "showAtLog<-code, reason": {
                "format": "[code], [reason]"
            }
        }
    ]
}->assertResult: {
    "id": "situation-should update ss",
    "contains": {
        "showAtLog": {
            "output": "-1, REFUSED/SUBLIMESOCKET_UPDATE:\tThe current running SublimeSocket api version = 1.4.2, this is out of date. please update SublimeSocket. this client requires SublimeSocket 2.0.0, see https:\/\/github.com\/sassembla\/SublimeSocket"
        }
    },
    "description": "not match."
}


test>closeAllBufferとselectors/createBuffer: {
    "name": "bufferForCloseAll.txt"
}->closeAllBuffer: {
    "injects": {
        "closeds": "message"
    },
    "selectors": [
        {
            "showAtLog<-message": {}
        }
    ]
}->assertResult: {
    "id": "ST3: closeAllBuffer with selectors.",
    "contains": {
        "showAtLog": {
            "output": ["bufferForCloseAll.txt"]
        }
    },
    "description": "not match."
}


test>適当に匿名のバッファを作り、現在のバッファとして閉じる/createBuffer: {
    "name": "something"
}->closeAllBuffer: {
    "selectors": [
        {
            "showAtLog<-closeds": {
                "format": "[closeds]"
            }
        }
    ]
}->assertResult: {
    "id": "ST3: close all buffer succeeded",
    "contains": {
        "showAtLog": {
            "output": "['something']"
        }
    },
    "description": "failed to close."
}


test>適当に複数の匿名のバッファを作り、現在のバッファとして閉じる/createBuffer: {
    "name": "something"
}->createBuffer: {
    "name": "something2"
}->closeAllBuffer: {
    "selectors": [
        {
            "showAtLog<-closeds": {
                "format": "[closeds]"
            }
        }
    ]
}->assertResult: {
    "id": "ST3: close all buffer succeeded2",
    "contains": {
        "showAtLog": {
            "output": "['something', 'something2']"
        }
    },
    "description": "failed to close."
}


test>特定の名称のファイルのバッファを作成/createBuffer: {
    "name": "test",
    "selectors": [
        {
            "showAtLog<-name": {
                "format": "[name] created."
            }
        }
    ]
}->assertResult: {
    "id": "creates valid name and contents",
    "contains": {
        "showAtLog": {
            "output": "test created."
        }
    },
    "description": "not contains."
}


test>存在するファイルを開く/openFile: {
    "path": "SUBLIMESOCKET_PATH:tests/testResources/sample.txt",
    "selectors": [
        {
            "showAtLog<-name": {
                "format": "[name]"
            }
        }
    ]
}->assertResult: {
    "id": "open exist file",
    "contains": {
        "showAtLog": {
            "output": "sample.txt"
        }
    },
    "description": "not contains."
}->closeFile: {
    "name": "sample.txt"
}


test>補完を外部からセット。候補が1つのため、強制的に補完される。/createBuffer: {
    "name": "completionTestView.txt"
}->一つだと一択のため勝手に入力される/runCompletion: {
    "name": "completionTestView.txt",
    "completion": [
        {
            "HEAD": "DrawLine",
            "paramsTargetFmt": "(${1:start}, ${2:end}, ${3:color}, ${4:duration}, ${5:depthTest})",
            "return": "Void",
            "paramsTypeDef": "(Vector3,Vector3,Color,Single,Boolean)",
            "head": "DrawLine"
        }
    ],
    "formathead": "HEADparamsTypeDef\treturn",
    "formattail": "headparamsTargetFmt$0",
    "selectors": [
        {
            "showAtLog<-name": {
                "format": "[name]"
            }
        }
    ]
}->assertResult: {
    "id": "completion makes input",
    "contains": {
        "showAtLog": {
            "output": "completionTestView.txt"
        }
    },
    "description": "not match."
}


test>ダイアログを表示/showDialog: {
    "message": "here comes daredevil",
    "selectors": [
        {
            "showAtLog<-message": {

            }
        }
    ]
}->assertResult: {
    "id": "show dialog contains values.",
    "contains": {
        "showAtLog": {
            "output": "here comes daredevil"
        }
    },
    "description": "not match."
}


test>ダイアログをフォーマット付きで表示/showDialog: {
    "format": "[0]:[a1] [b1] [c1] [d1]",
    "0": "header",
    "a1": "the",
    "b1": "test",
    "c1": "is",
    "d1": "over",
    "selectors": [
        {
            "showAtLog<-message": {

            }
        }
    ]
}->assertResult: {
    "id": "show dialog contains values.",
    "contains": {
        "showAtLog": {
            "output": "header:the test is over"
        }
    },
    "description": "not match."
}


test>afterAsyncのtest/afterAsync: {
    "identity": "testIdentity",
    "ms": 100,
    "selectors": [
        {
            "showAtLog": {
                "message": "hello after 100"
            }
        }
    ]
}->wait:{
    "ms": 200
}->assertResult: {
    "id": "check simple afterAsync",
    "contains": {
        "showAtLog": {
            "output": "hello after 100"
        }
    },
    "description": "not match."
}


test>afterAsyncの多重動作test/afterAsync: {
    "identity": "testIdentity",
    "ms": 100,
    "selectors": [
        {
            "showAtLog": {
                "message": "hello after 100"
            }
        }
    ]
}->afterAsync: {
    "identity": "testIdentity",
    "ms": 150,
    "selectors": [
        {
            "showAtLog": {
                "message": "hello after 150"
            }
        }
    ]
}->wait:{
    "ms": 200
}->assertResult: {
    "id": "check dual afterAsync 1",
    "notcontains": {
        "showAtLog": {
            "output": "hello after 100"
        }
    },
    "description": "not match."
}->assertResult: {
    "id": "check dual afterAsync 2",
    "contains": {
        "showAtLog": {
            "output": "hello after 150"
        }
    },
    "description": "not match."
}


test>afterAsyncとinjects/afterAsync: {
    "identity": "testIdentity",
    "ms": 100,
    "message": "message after 100!",
    "selectors": [
        {
            "showAtLog<-message": {

            }
        }
    ]
}->wait:{
    "ms": 200
}->assertResult: {
    "id": "check with simple injects for afterAsync",
    "contains": {
        "showAtLog": {
            "output": "message after 100!"
        }
    },
    "description": "not match."
}


test>afterAsyncとinjects その2/afterAsync: {
    "identity": "testIdentity",
    "ms": 100,
    "currentMessage": "message after 100! take2",
    "injects": {
        "currentMessage": "message"
    },
    "selectors": [
        {
            "showAtLog<-message": {

            }
        }
    ]
}->wait:{
    "ms": 200
}->assertResult: {
    "id": "check with injects for afterAsync",
    "contains": {
        "showAtLog": {
            "output": "message after 100! take2"
        }
    },
    "description": "not match."
}


test>afterAsyncのcancel動作/afterAsync: {
    "identity": "testIdentity",
    "ms": 100,
    "selectors": [
        {
            "showAtLog": {
                "message": "hello after 100"
            }
        }
    ]
}->afterAsync: {
    "identity": "testIdentity",
    "ms": 150,
    "selectors": [
        
    ]
}->wait:{
    "ms": 200
}->assertResult: {
    "id": "check cancel afterAsync",
    "notcontains": {
        "showAtLog": {
            "output": "hello after 100"
        }
    },
    "description": "not match."
}


test>afterAsyncの他selectorsからの動作/createBuffer: {
    "name": "bufferForAsync.txt"
}->viewEmit: {
    "identity": "identityOfAfterAsync",
    "name": "bufferForAsync.txt",
    "selectors": [
        {
            "afterAsync": {
                "identity": "testIdentity",
                "ms": 100,
                "selectors": [
                    {
                        "showAtLog": {
                            "message": "hello after 100 take3"
                        }
                    }
                ]
            }
        }
    ]
}->wait:{
    "ms": 200
}->assertResult: {
    "id": "check afterAsync from other selectors",
    "contains": {
        "showAtLog": {
            "output": "hello after 100 take3"
        }
    },
    "description": "not match."
}


test>closeAllFiles: {
    "dryrun": true,
    "selectors": [
        {
            "showAtLog<-closeds": {
                "format": "[closeds]"
            }
        }
    ]
}->assertResult: {
    "id": "close all files for test in ST2",
    "isnotempty": "showAtLog",
    "description": "is empty."
}

