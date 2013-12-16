# -*- coding: utf-8 -*-
import sublime, sublime_plugin

from . import SublimeWSSettings
import json

from .SublimeWSEncoder import SublimeWSEncoder
from . import SublimeSocketAPISettings

import subprocess
import shlex
import os

import re
from functools import reduce

from .PythonSwitch import PythonSwitch
import uuid


MY_PLUGIN_PATHNAME = os.path.split(os.path.dirname(os.path.realpath(__file__)))[1]


## API Parse the action
class SublimeSocketAPI:
	def __init__(self, server):
		self.server = server
		self.encoder = SublimeWSEncoder()
		self.windowBasePath = sublime.active_window().active_view().file_name()

	# results
	def initResult(self, resultIdentity):
		return {resultIdentity:{}}

	def resetResults(self, results):
		results = {}
		return results

	def setResultsParams(self, results, apiFunc, value):
		# only one key.
		assert len(results) == 1, "in setResultsParams, too much keys found."
		apiFuncIdentity = (apiFunc.__name__, str(uuid.uuid4()))
		for key in results:
			results[key][apiFuncIdentity] = value
			return results


	def addInnerResult(self, results, innerResults):
		for key in results:
			results[key] = innerResults
			return results

	def resultBody(self, results):
		for key in results:
			return results[key]
			
		return {}


	## Parse the API command via WebSocket
	def parse(self, data, client=None, results=None):
		# print("parse sourceData is ", data, "len", len(data))
		print("parse開始の時点で", results)
		
		# SAMPLE: inputIdentity:{"id":"537d5da6-ce7d-42f0-387b-d9c606465dbb"}->showAlert...
		commands = data.split(SublimeSocketAPISettings.API_CONCAT_DELIM)

    	# command and param  SAMPLE:		inputIdentity:{"id":"537d5da6-ce7d-42f0-387b-d9c606465dbb"}
		for commandIdentityAndParams in commands :
			command_params = commandIdentityAndParams.split(SublimeSocketAPISettings.API_COMMAND_PARAMS_DELIM, 1)
			command = command_params[0]

			params = ''
			if 1 < len(command_params):
				try:
					data = command_params[1].replace("\r\n", "\n")
					data = data.replace("\r", "\n")
					data = data.replace("\n", "\\n")
					data = data.replace("\t", "    ")
					params = json.loads(data)
				except Exception as e:
					print("JSON parse error", e, "source = ", command_params[1])
					return
					
			self.runAPI(command, params, client, results)
			
		return results


	def innerParse(self, data, client=None, results=None):
		print("innerParseでの初期results", results)
		currentResults = self.initResult("inner:"+str(uuid.uuid4()))
		innerResults = self.parse(data, client, currentResults)

		print("innerParseでのinnerResults", innerResults)
		return self.addInnerResult(results, innerResults)


	## run the specified API with JSON parameters. Dict or Array of JSON.
	def runAPI(self, command, params=None, client=None, results=None):
		# print("runAPI command", command)
		
		# erase comment
		if SublimeSocketAPISettings.API_COMMENT_DELIM in command:
			splitted = command.split(SublimeSocketAPISettings.API_COMMENT_DELIM, 1)
			command = splitted[1]


		# attach bridgedParams and remove.
		if SublimeSocketAPISettings.API_PARAM_END in command:
			splitted = command.split(SublimeSocketAPISettings.API_PARAM_END, 1)
			command = splitted[1]
			
			# separate by delim
			keyValues = splitted[0][1:]# remove SublimeSocketAPISettings.API_PARAM_START
			keyValuesArray = keyValues.split(SublimeSocketAPISettings.API_PARAM_DELIM)

			for keyAndValue in keyValuesArray:
				# key|valueKey
				keyAndValueArray = keyAndValue.split(SublimeSocketAPISettings.API_PARAM_CONCAT)
				
				key = keyAndValueArray[0]
				value = keyAndValueArray[1]

				# replace params with bridgedParams-rule
				assert key in results, "no-key in results. should use the API that have results."

				params[value] = results[key]
  		# python-switch
		for case in PythonSwitch(command):
			if case(SublimeSocketAPISettings.API_RUNTESTS):
				self.runTests(params, client, results)
				break

			if case(SublimeSocketAPISettings.API_ASSERTRESULT):
				assertedResult = self.assertResult(params, results)

				# send for display
				buf = self.encoder.text(assertedResult, mask=0)
				client.send(buf)
				break

			if case(SublimeSocketAPISettings.API_ASSERTKVS):
				assertedResult = self.assertKVS(params)

				# send for display
				buf = self.encoder.text(assertedResult, mask=0)
				client.send(buf)
				break

			if case(SublimeSocketAPISettings.API_RUNSETTING):
				filePath = params[SublimeSocketAPISettings.RUNSETTING_FILEPATH]
				result = self.runSetting(filePath, client)
				if client:
					buf = self.encoder.text(result, mask=0)
					client.send(buf)
				break

			if case(SublimeSocketAPISettings.API_INPUTIDENTITY):
				self.server.updateClientId(client, params)
				break

			if case(SublimeSocketAPISettings.API_TEARDOWN):
				self.server.tearDown()
				break

			if case(SublimeSocketAPISettings.API_CONTAINSREGIONS):
				self.containsRegions(params)
				break

			if case(SublimeSocketAPISettings.API_COLLECTVIEWS):
				self.server.collectViews()
				break

			if case(SublimeSocketAPISettings.API_KEYVALUESTORE):
				result = self.server.KVSControl(params)
				
				# print("kvs result", result)
				buf = self.encoder.text(result, mask=0)
				client.send(buf)
				break

			if case(SublimeSocketAPISettings.API_TIMEREVENT):
				#残りのタスクを内包して、非同期で抜ける。
				print("Timer params ", params)
				# どんな分散をするか、
				# self.timerEventSetIntreval()
				break
				
			if case(SublimeSocketAPISettings.API_DEFINEFILTER):
				# define filter
				self.defineFilter(params)
				break

			if case(SublimeSocketAPISettings.API_FILTERING):
				# run filtering
				self.runFiltering(params, results)
				break

			if case(SublimeSocketAPISettings.API_SETREACTOR):
				# set reactor
				self.setReactor(params, client)
				break

			if case(SublimeSocketAPISettings.API_SETFOUNDATIONREACTOR):
				# set foundationReactor
				self.setFoundationReactor(params, client)
				break

			if case(SublimeSocketAPISettings.API_RUNSHELL):
				self.runShell(params)
				break

			if case(SublimeSocketAPISettings.API_BROADCASTMESSAGE):
				self.broadcastMessage(params)
				break

			if case(SublimeSocketAPISettings.API_MONOCASTMESSAGE):
				self.monocastMessage(params)
				break

			if case(SublimeSocketAPISettings.API_EVAL):
				self.sublimeEval(params, client)
				break

			if case(SublimeSocketAPISettings.API_SHOWATLOG):
				self.showAtLog(params)
				break

			if case(SublimeSocketAPISettings.API_APPENDREGION):
				self.appendRegion(params)
				break
			if case(SublimeSocketAPISettings.API_RUNWITHBUFFER):
				self.runWithBuffer(params)
				break
			if case(SublimeSocketAPISettings.API_NOTIFY):
				self.notify(params)
				break
			if case(SublimeSocketAPISettings.API_GETALLFILEPATH):
				self.getAllFilePath(params, results)
				break

			if case(SublimeSocketAPISettings.API_READFILEDATA):
				self.readFileData(params, results)
				break

			if case(SublimeSocketAPISettings.API_EVENTEMIT):
				self.eventEmit(params)
				break

			if case(SublimeSocketAPISettings.API_CANCELCOMPLETION):
				self.cancelCompletion(params)
				break

			if case(SublimeSocketAPISettings.API_PREPARECOMPLETION):
				self.prepareCompletion(params)
				break

			if case(SublimeSocketAPISettings.API_RUNCOMPLETION):
				self.runCompletion(params)
				break
			if case(SublimeSocketAPISettings.API_OPENPAGE):
				self.openPage(params)
				break

			if case(SublimeSocketAPISettings.API_SETWINDOWBASEPATH):
				self.setWindowBasePath()
				break

			# internal APIS
			if case(SublimeSocketAPISettings.API_I_SHOWSTATUSMESSAGE):
				self.showStatusMessage(params)
				break

			if case(SublimeSocketAPISettings.API_I_ERASEALLREGION):
				self.eraseAllRegion()
				break

			if case (SublimeSocketAPISettings.API_VERSIONVERIFY):
				self.versionVerify(params, client)
				break

			if case():
				print("unknown command", command, "/")
				break


	## run API with interval.
	def runOnInterval(self, key):
		print("runOnInterval", key)

	## run specific setting.txt file as API
	def runSetting(self, filePath, client):
		
		# check contains PREFIX or not
		if filePath.startswith(SublimeSocketAPISettings.RUNSETTING_PREFIX_SUBLIMESOCKET_PATH):
			filePathArray = filePath.split(":")
			filePath = sublime.packages_path() + "/"+MY_PLUGIN_PATHNAME+"/"+ filePathArray[1]


		print("ss: runSetting:", filePath)
		
		settingFile = open(filePath, 'r')
		setting = settingFile.read()
		settingFile.close()

		# print "setting", setting

		# remove //comment line
		removeCommented_setting = re.sub(r'//.*', r'', setting)
		
		# remove spaces
		removeSpaces_setting = re.sub(r'(?m)^\s+', '', removeCommented_setting)
		
		# remove CRLF
		removeCRLF_setting = removeSpaces_setting.replace("\n", "")
		
		commands = removeCRLF_setting
		# print "result", result

		# parse
		print("runSettingでinnerParseしてる")
		self.innerParse(commands, client)

		return "runSettings:"+str(removeCRLF_setting)

	## run shellScript
	# params is array that will be evaluated as commandline marameters.
	def runShell(self, params):
		assert SublimeSocketAPISettings.RUNSHELL_MAIN in params, "runShell require 'main' param"

		if SublimeSocketAPISettings.RUNSHELL_DELAY in params:
			delay = params[SublimeSocketAPISettings.RUNSHELL_DELAY]
			del params[SublimeSocketAPISettings.RUNSHELL_DELAY]
			
			if type(delay) is str:
				delay = int(delay)
				
			sublime.set_timeout(self.runShell(params), delay)

			return

		main = params[SublimeSocketAPISettings.RUNSHELL_MAIN]
		
		def genKeyValuePair(key):
			val = ""


			def replaceValParts(val):
				val = val.replace(" ", SublimeSocketAPISettings.RUNSHELL_REPLACE_SPACE);
				val = val.replace("(", SublimeSocketAPISettings.RUNSHELL_REPLACE_RIGHTBRACE);
				val = val.replace(")", SublimeSocketAPISettings.RUNSHELL_REPLACE_LEFTBRACE);
				val = val.replace("'", SublimeSocketAPISettings.RUNSHELL_REPLACE_SINGLEQUOTE);
				val = val.replace("`", SublimeSocketAPISettings.RUNSHELL_REPLACE_SINGLEQUOTE);
				val = val.replace("@s@s@", SublimeSocketAPISettings.RUNSHELL_REPLACE_At_s_At_s_At);

				# check contains PREFIX or not
				if val.startswith(SublimeSocketAPISettings.RUNSETTING_PREFIX_SUBLIMESOCKET_PATH):
					filePathArray = val.split(":")
					val = "\"" + sublime.packages_path() + "/"+MY_PLUGIN_PATHNAME+"/"+ filePathArray[1] + "\""

				return val

			if type(params[key]) == list:

				replaced = [replaceValParts(v) for v in params[key]]
				val = ' '.join(replaced)
			else:
				val = replaceValParts(str(params[key]))


			if len(val) is 0:
				return key

			if len(key) is 0:
				return val

			return key + ' ' + val

		kvPairArray = [genKeyValuePair(key) for key in params.keys() if key not in SublimeSocketAPISettings.RUNSHELL_LIST_IGNORES]
		kvPairArray.insert(0, main) 

		runnable = ' '.join(kvPairArray)
		debugFlag = False

		if SublimeSocketAPISettings.RUNSHELL_DEBUG in params:
			debugFlag = params[SublimeSocketAPISettings.RUNSHELL_DEBUG]
			

		if debugFlag:
			print("runnable", runnable)
		
		if len(runnable):
			subprocess.call(runnable, shell=True)

	## emit message to clients.
	# broadcast messages if no-"target" key.
	def broadcastMessage(self, params):
		assert SublimeSocketAPISettings.OUTPUT_MESSAGE in params, "broadcastMessage require 'message' param"
		
		message = params[SublimeSocketAPISettings.OUTPUT_MESSAGE]
		# header and footer with delimiter
		delim = ""
		if SublimeSocketAPISettings.OUTPUT_DELIMITER in params:
			delim = params[SublimeSocketAPISettings.OUTPUT_DELIMITER]

		if SublimeSocketAPISettings.OUTPUT_HEADER in params:
			message = params[SublimeSocketAPISettings.OUTPUT_HEADER] + delim + message

		if SublimeSocketAPISettings.OUTPUT_FOOTER in params:
			message = message + delim + params[SublimeSocketAPISettings.OUTPUT_FOOTER]
		
		# if sender specified, add "sender:" ahead of message.
		if SublimeSocketAPISettings.OUTPUT_SENDER in params:
			message = params[SublimeSocketAPISettings.OUTPUT_SENDER] + ":" + message
		
		buf = self.encoder.text(str(message), mask=0)
		
		clients = self.server.clients.values()
		for client in clients:
			client.send(buf)

	## send message to the specific client.
	def monocastMessage(self, params):
		if SublimeSocketAPISettings.OUTPUT_FORMAT in params:
			format = params[SublimeSocketAPISettings.OUTPUT_FORMAT]
			for key in params:
				if key != SublimeSocketAPISettings.OUTPUT_TARGET:
					if key != SublimeSocketAPISettings.OUTPUT_FORMAT:
						currentParam = params[key]
						format = format.replace(key, currentParam)

			params[SublimeSocketAPISettings.OUTPUT_MESSAGE] = format
			del params[SublimeSocketAPISettings.OUTPUT_FORMAT]
			self.monocastMessage(params)
			return

		assert SublimeSocketAPISettings.OUTPUT_TARGET in params, "monocastMessage require 'target' param"
		assert SublimeSocketAPISettings.OUTPUT_MESSAGE in params, "monocastMessage require 'message' param"
		
		target = params[SublimeSocketAPISettings.OUTPUT_TARGET]
		message = params[SublimeSocketAPISettings.OUTPUT_MESSAGE]

		# header and footer with delimiter
		delim = ""
		if SublimeSocketAPISettings.OUTPUT_DELIMITER in params:
			delim = params[SublimeSocketAPISettings.OUTPUT_DELIMITER]

		if SublimeSocketAPISettings.OUTPUT_HEADER in params:
			message = params[SublimeSocketAPISettings.OUTPUT_HEADER] + delim + message

		if SublimeSocketAPISettings.OUTPUT_FOOTER in params:
			message = message + delim + params[SublimeSocketAPISettings.OUTPUT_FOOTER]


		# if sender specified, add "sender:" ahead of message.
		if SublimeSocketAPISettings.OUTPUT_SENDER in params:
			message = params[SublimeSocketAPISettings.OUTPUT_SENDER] + ":" + message
		
		
		if target in self.server.clients:
			client = self.server.clients[target]
			buf = self.encoder.text(str(message), mask=0)
			client.send(buf)

		else:
			print("monocastMessage failed. target:", target, "is not exist in clients:", self.server.clients)


	## send message to the other via SS.
	def showAtLog(self, params):

		assert SublimeSocketAPISettings.LOG_MESSAGE in params, "showAtLog require 'message' param"
		message = params[SublimeSocketAPISettings.LOG_MESSAGE]
		print(SublimeSocketAPISettings.LOG_prefix, message)


	## run testus
	def runTests(self, params, client, results):
		assert SublimeSocketAPISettings.RUNTESTS_PATH in params, "runTests require 'path' param"
		filePath = params[SublimeSocketAPISettings.RUNTESTS_PATH]
		
		# check contains PREFIX or not
		if filePath.startswith(SublimeSocketAPISettings.RUNSETTING_PREFIX_SUBLIMESOCKET_PATH):
			filePathArray = filePath.split(":")
			filePath = sublime.packages_path() + "/"+MY_PLUGIN_PATHNAME+"/"+ filePathArray[1]
		
		settingFile = open(filePath, 'r')
		setting = settingFile.read()
		settingFile.close()

		# print "setting", setting

		# remove //comment line
		removeCommented_setting = re.sub(r'//.*', r'', setting)
		
		# remove spaces
		removeSpaces_setting = re.sub(r'(?m)^\s+', '', removeCommented_setting)
		
		# remove CRLF
		removeCRLF_setting = removeSpaces_setting.replace("\n", "")
		
		source = removeCRLF_setting

		# parse then get results
		results = self.innerParse(source, client, results)

		# count Pass/Fail
		def collectAsserts(key):
			def detectAssert(results, keyAndId):
				if keyAndId[0] is self.assertResult.__name__:
					return results[keyAndId]
						
			the1stInnerResults = results[key]
			for the2NdInnerResultKey in the1stInnerResults:
				the2NdInnerResult = the1stInnerResults[the2NdInnerResultKey]
				return [detectAssert(the2NdInnerResult, key) for key in the2NdInnerResult]


		assertedResultsWithNone = [collectAsserts(the1stInnerResultsKey) for the1stInnerResultsKey in results]
		

		def countAsserts(assertionIdAndResult):
			for assertionId in assertionIdAndResult:
				result = assertionIdAndResult[assertionId]
				if SublimeSocketAPISettings.ASSERTRESULT_VALUE_PASS in result:
					return 1
				else:
					return -1

		counted = [countAsserts(result) for result in assertedResultsWithNone[0] if result]

		passed = counted.count(1)
		failed = counted.count(-1)
			
		# count ASSERTRESULT_VALUE_PASS or ASSERTRESULT_VALUE_FAIL
		message = "TOTAL:" + str(passed + failed) + " passed:" + str(passed) + " failed:" + str(failed)
		buf = self.encoder.text(message, mask=0)
		client.send(buf);

		
	## assertions
	def assertResult(self, params, results):
		print("assertResult start", results, "params", params)

		# assertResult start {'inner:a1c0066e-39ae-4fd1-b532-3c6589189c47': {('runFiltering', '3bb9aac6-fd1a-41c1-9046-c6288ed4f08c'): [{'13/12/04 18:16:49': {'message': 'should be 1/2:1\n2  in 1\n2 dummyline/.'}}]}} params {'id': 'contains value', 'message': 'notmatch.', 'contains': {'runFiltering': {'13/12/0418: 16: 49': {'message': 'shouldbe1/2: 1\n2in1\n2dummyline/.'}}}}

		resultBodies = self.resultBody(results)
		print("resultBodies", resultBodies)


		assert SublimeSocketAPISettings.ASSERTRESULT_ID in params, "assertResult require 'id' param"
		assert SublimeSocketAPISettings.ASSERTRESULT_MESSAGE in params, "assertResult require 'message' param"
		
		assertionIdentity = params[SublimeSocketAPISettings.ASSERTRESULT_ID]
		message = params[SublimeSocketAPISettings.ASSERTRESULT_MESSAGE]
		
		def assertionMessage(assertType, identity, message):
			return assertType + " " + identity + " : " + message

		# contains
		if SublimeSocketAPISettings.ASSERTRESULT_CONTAINS in params:
			currentDict = params[SublimeSocketAPISettings.ASSERTRESULT_CONTAINS]
			
			# match
			for key in currentDict:
				for resultKey in resultBodies:
					if resultKey[0] == key:
						assertValue = currentDict[key]
						assertTarget = resultBodies[resultKey]

						if assertValue == assertTarget:
							resultMessage = assertionMessage(SublimeSocketAPISettings.ASSERTRESULT_VALUE_PASS,
								assertionIdentity, 
								key + ":" + str(assertValue) + " in " + str(resultBodies[resultKey]))
							self.setResultsParams(results, self.assertResult, {assertionIdentity:resultMessage})
							return resultMessage
			
			# fail
			resultMessage = assertionMessage(SublimeSocketAPISettings.ASSERTRESULT_VALUE_FAIL,
							assertionIdentity, 
							message)

			self.setResultsParams(results, self.assertResult, {assertionIdentity:resultMessage})
			return resultMessage


		# not contains
		if SublimeSocketAPISettings.ASSERTRESULT_NOTCONTAINS in params:
			# fail
			resultMessage = assertionMessage(SublimeSocketAPISettings.ASSERTRESULT_VALUE_FAIL,
							assertionIdentity, 
							message)

			self.setResultsParams(results, self.assertResult, {assertionIdentity:resultMessage})
			return resultMessage



		# expect
		elif SublimeSocketAPISettings.ASSERTRESULT_EXPECTS in params:
			print("expects hit, start check at", params[SublimeSocketAPISettings.ASSERTRESULT_EXPECTS])
			print("timeassert not yet implemented")
			
			# fail
			resultMessage = assertionMessage(SublimeSocketAPISettings.ASSERTRESULT_VALUE_FAIL,
							assertionIdentity, 
							message)

			self.setResultsParams(results, self.assertResult, {assertionIdentity:resultMessage})
			return resultMessage

		resultMessage = assertionMessage(SublimeSocketAPISettings.ASSERTRESULT_VALUE_FAIL,
			assertionIdentity,
			"assertion aborted in assertResult API.")
		
		self.setResultsParams(results, self.assertResult, {assertionIdentity:resultMessage})
		
		return resultMessage


	def assertKVS(self, params):
		print("assertResult", params)
		currentResults = []

		# key is typed as JSON, 
		# {"a": {"b": {"c": "d"}}}
		# -> ここから、aのbのcの値がdである、みたいな形を出す。*でワイルドカードを赦す。
		# paramsのメインキーの数だけ有り得る。forだ。
		assertionDict = {}
		for assertIdentityKey, nestedKeysAndTheValue in params.items():
			print("assertIdentityKey", assertIdentityKey)
			print("nestedKeysAndTheValue", nestedKeysAndTheValue)

			
			keysAndValueOneLine = []

			# {key:{"a": {"b": {"c": "theValue"}}}}
			# -> key:(["a","b","c"],"theValue")
			def getKeysAndValueOneLine(key, value):

				keysAndValueOneLine.append(key)
				if type(value) is dict:
					# 単に再帰
					for currentKey, currentValue in value.items():
						return getKeysAndValueOneLine(currentKey, currentValue)
					
				elif type(value) is list:
					pass

				else:
					keysAndValueOneLine.append(value)
					

			[getKeysAndValueOneLine(key, coValue) for key, coValue in nestedKeysAndTheValue.items()]
			assertionDict[assertIdentityKey] = (keysAndValueOneLine[0:-1], keysAndValueOneLine[-1])


		def assertKV(keys, target, source, index):
			# if nextKey == "*":,,,, not yet impemented
			# 	# wildcard, means get first or False = no key, failure.


			nextKey = keys[index+1]

			if type(source) == dict:
				nextSource = source[nextKey]

			elif type(source) == list:
				if type(nextKey) == int:
					nextSource = source[nextKey]
				else:
					return (False, "target is list, should be use number for index.")
			else:
				return (False, "no key error")

			if type(nextSource) == str:
				if nextSource == target:
					message = "matched.", keys, " = ", target
					return (True, message)

				else:
					message = "not match,", keys, " expected:", target, ", actual:", nextSource
					return (False, message)

			elif type(nextSource) == dict:
				return assertKV(keys, target, nextSource, index+1)
			elif type(nextSource) == list:
				return assertKV(keys, target, nextSource, index+1)
			else:
				print("not yet implemented,", type(nextSource))

		# assertionDict build comoleted

		currentResults = [assertKV(assertionDict[key][0], assertionDict[key][1], self.server.getV(assertionDict[key][0][0]), 0) for key in assertionDict.keys()]
		return str(currentResults)


	## is contains regions or not.
	def containsRegions(self, params):
		self.server.containsRegions(params)
		
	## Define the filter and check filterPatterns
	def defineFilter(self, params):
		# check filter name
		assert SublimeSocketAPISettings.DEFINEFILTER_NAME in params, "defineFilter require 'name' key."

		# load defined filters
		filterNameAndPatternsArray = {}

		if self.server.isExistOnKVS(SublimeSocketAPISettings.DICT_FILTERS):
			filterNameAndPatternsArray = self.server.getV(SublimeSocketAPISettings.DICT_FILTERS)

		filterName = params[SublimeSocketAPISettings.DEFINEFILTER_NAME]

		patterns = params[SublimeSocketAPISettings.DEFINEFILTER_PATTERNS]
		assert type(patterns) == list, "defineFilter require: filterPatterns must be list."

		def mustBeSingleDict(filterDict):
			assert len(filterDict) is 1, "defineFilter. too many filter in one dictionary. len is "+str(len(filterDict))
			

		[mustBeSingleDict(currentFilterDict) for currentFilterDict in patterns]

		# key = filterName, value = the match patterns of filter.
		filterNameAndPatternsArray[filterName] = patterns

		# store
		self.server.setKV(SublimeSocketAPISettings.DICT_FILTERS, filterNameAndPatternsArray)
		

	## filtering. matching -> run API
	def runFiltering(self, params, results):
		assert SublimeSocketAPISettings.FILTER_NAME in params, "filtering require 'filterName' param"

		filterName = params[SublimeSocketAPISettings.FILTER_NAME]

		# check filterName exists or not
		if not self.server.isFilterDefined(filterName):
			print("filterName:"+str(filterName)+" is not yet defined.")
			return

		filterSource = params[SublimeSocketAPISettings.FILTER_SOURCE]
		# print "filterName", filterName, "	/filterSource",filterSource

		# get filter key-values array
		filterPatternsArray = self.server.getV(SublimeSocketAPISettings.DICT_FILTERS)[filterName]

		# print "filterPatternsArray", filterPatternsArray
		currentResults = []
		for pattern in filterPatternsArray:
			# regx key filterSource
			print("pattern", pattern)
			# -----CompilerOutput:-stdout--exitcode: 1--compilationhadfailure: True--outfile: Temp/Assembly-CSharp.dll
			# Compilation failed: 1 error(s), 0 warnings
			# Assets/NewBehaviourScript.cs(6,12): error CS8025: Parsing error
			# (Filename: Assets/NewBehaviourScript.cs Line: 6)
			# print "pattern is ", pattern
			
			for key_executableDictPair in pattern.items():
				(key, executablesDict) = key_executableDictPair

			# src = """re.search(r"(""" + key + """)", """ + "\"" + filterSource + "\"" + """, re.DOTALL)"""			
			# src = """re.search(r"(""" + key + """)", """ + "\"" + filterSource + "\"" + """, re.DOTALL)"""
			
			debug = False
			if type(params) == dict:
				if SublimeSocketAPISettings.FILTER_DEBUG in params:
					debug = params[SublimeSocketAPISettings.FILTER_DEBUG]

			if debug:
				print("filterSource", filterSource)


			for searched in re.finditer(re.compile(r'%s' % key, re.M), filterSource):
				
				if searched:
					if debug:
						print("matched.")
						print("filtering regexp:", key)
						print("filterSource", filterSource)
						print("filtering searched.group()",searched.group())
						print("filtering searched.groups()",searched.groups())
						

					executablesArray = executablesDict[SublimeSocketAPISettings.FILTER_SELECTORS]

					if SublimeSocketAPISettings.FILTER_DEBUG in executablesDict:
						if executablesDict[SublimeSocketAPISettings.FILTER_DEBUG]:
							print("matched defineFilter selectors:", executablesArray)
							print("matched group()", searched.group())
							print("matched groups()", searched.groups())
						
							if SublimeSocketAPISettings.FILTER_COMMENT in executablesDict:
								print("matched defineFilter comment:", executablesDict[SublimeSocketAPISettings.FILTER_COMMENT])

					currentGroupSize = len(searched.groups())
					
					# run
					for executableDict in executablesArray:
						
						# execute
						for executableDictKey in executableDict.keys():
							command = executableDictKey
							break
						
						# print "command", command
						
						paramsSource = executableDict[command]

						params = None
						# replace the keyword "groups[x]" to regexp-result value of the 'groups[x]', if params are string-array
						if type(paramsSource) == list:
							# before	eval:["sublime.message_dialog('groups[0]')"]
							# after		eval:["sublime.message_dialog('THE_VALUE_OF_searched.groups()[0]')"]
							
							def replaceGroupsInListKeyword(param):
								result = param
								
								for index in range(currentGroupSize):
									# replace all expression
									if re.findall(r'groups\[(' + str(index) + ')\]', result):
										result = re.sub(r'groups\[' + str(index) + '\]', searched.groups()[index], result)

								result = re.sub(r'filterSource\[\]', filterSource, result)
								return result
								

							# replace "groups[x]" expression in the value of list to 'searched.groups()[x]' value
							params = map(replaceGroupsInListKeyword, paramsSource)
							
						elif type(paramsSource) == dict:
							# before {u'line': u'groups[1]', u'message': u'message is groups[0]'}
							# after	 {u'line': u'THE_VALUE_OF_searched.groups()[1]', u'message': u'message is THE_VALUE_OF_searched.groups()[0]'}

							def replaceGroupsInDictionaryKeyword(key):
								result = paramsSource[key]
								
								for index in range(currentGroupSize):
									
									# replace all expression
									if re.findall(r'groups\[(' + str(index) + ')\]', result):
										froms = searched.groups()[index]
										result = re.sub(r'groups\[' + str(index) + '\]', froms, result)

								result = re.sub(r'filterSource\[\]', filterSource, result)
								return {key:result}
							# replace "groups[x]" expression in the value of dictionary to 'searched.groups()[x]' value
							params_dicts = list(map(replaceGroupsInDictionaryKeyword, paramsSource.keys()))

							if not params_dicts:
								pass
							elif 1 == len(params_dicts):
								params = params_dicts[0]
							else:
								def reduceLeft(before, next):
									# append all key-value pair.
									for key in next.keys():
										before[key] = next[key]
									return before
								
								params = reduce(reduceLeft, params_dicts[1:], params_dicts[0])
							
						else:
							print("filtering warning:unknown type")
						
						if debug:
							print("filtering command:", command, "params:", params)

						# execute
						self.runAPI(command, params, None, results)
						
						# report
						currentResults.append({filterName:params})

				else:
					if debug:
						print("filtering not match")

		# return succeded signal
		if 0 < len(currentResults):
			# set params into results
			self.setResultsParams(results, self.runFiltering, currentResults)


	## set reactor for reactive-event
	def setReactor(self, params, client):
		self.server.setOrAddReactor(params, client)
		
	## set FOUNDATION reactor for "foundation" categoly events.
	def setFoundationReactor(self, params, client):
		params[SublimeSocketAPISettings.REACTOR_TARGET] = SublimeSocketAPISettings.FOUNDATIONREACTOR_TARGET_DEFAULT
		params[SublimeSocketAPISettings.REACTOR_INTERVAL] = SublimeSocketAPISettings.FOUNDATIONREACTOR_INTERVAL_DEFAULT
		self.server.setOrAddReactor(params, client)

	## get the target view-s information if params includes "filename.something" or some pathes represents filepath.
	def internal_detectViewInstance(self, path):
		if self.server.viewDict():
			viewSourceStr = path

			# remove empty and 1 length string pattern.
			if not viewSourceStr or len(viewSourceStr) is 1:
				return None

				
			viewDict = self.server.viewDict()
			viewKeys = viewDict.keys()

			viewSourceStr = viewSourceStr.replace("\\", "&")
			viewSourceStr = viewSourceStr.replace("/", "&")

			# straight full match in viewSourceStr. "/aaa/bbb/ccc.d something..." vs "*********** /aaa/bbb/ccc.d ***********"
			for viewKey in viewKeys:
				# replace path-expression by component with &.
				viewSearchKey = viewKey.replace("\\", "&")
				viewSearchKey = viewSearchKey.replace("/", "&")

				if re.findall(viewSearchKey, viewSourceStr):
					return viewDict[viewKey][SublimeSocketAPISettings.VIEW_SELF]

			# partial match in viewSourceStr. "ccc.d" vs "********* ccc.d ************"
			for viewKey in viewKeys:
				viewBasename = viewDict[viewKey][SublimeSocketAPISettings.VIEW_BASENAME]

				if viewBasename in viewSourceStr:
					return viewDict[viewKey][SublimeSocketAPISettings.VIEW_SELF]

		# totally, return None and do nothing
		return None

	########## APIs for shortcut ST2-Display ##########

	## show message on ST
	def showStatusMessage(self, params):
		assert SublimeSocketAPISettings.SHOWSTATUSMESSAGE_MESSAGE in params, "showStatusMessage require 'message' param"
		
		sublime.status_message(params[SublimeSocketAPISettings.SHOWSTATUSMESSAGE_MESSAGE])
		

	## append region on ST
	def appendRegion(self, params):
		assert SublimeSocketAPISettings.APPENDREGION_VIEW in params, "appendRegion require 'view' param"
		assert SublimeSocketAPISettings.APPENDREGION_LINE in params, "appendRegion require 'line' param"
		assert SublimeSocketAPISettings.APPENDREGION_MESSAGE in params, "appendRegion require 'message' param"
		assert SublimeSocketAPISettings.APPENDREGION_CONDITION in params, "appendRegion require 'condition' param"
		
		view = params[SublimeSocketAPISettings.APPENDREGION_VIEW]
		line = params[SublimeSocketAPISettings.APPENDREGION_LINE]
		message = params[SublimeSocketAPISettings.APPENDREGION_MESSAGE]
		condition = params[SublimeSocketAPISettings.APPENDREGION_CONDITION]
		
		self.checkIfViewExist_appendRegion_Else_notFound(view, self.internal_detectViewInstance(view), line, message, condition)


	## emit ss_runWithBuffer event
	def runWithBuffer(self, params):
		assert SublimeSocketAPISettings.RUNWITHBUFFER_VIEW in params, "runWithBuffer require 'view' param"
		self.server.fireKVStoredItem(SublimeSocketAPISettings.SS_FOUNDATION_RUNWITHBUFFER, params)


	## emit notification mechanism
	def notify(self, params):
		assert SublimeSocketAPISettings.NOTIFY_TITLE in params, "notify require 'title' param"
		assert SublimeSocketAPISettings.NOTIFY_MESSAGE in params, "notify require 'message' param"

		title = params[SublimeSocketAPISettings.NOTIFY_TITLE]
		message = params[SublimeSocketAPISettings.NOTIFY_MESSAGE]
		
		env = sublime.platform() 

		if env == "osx":
			debug = False
			if SublimeSocketAPISettings.NOTIFY_DEBUG in params:
				debug = params[SublimeSocketAPISettings.NOTIFY_DEBUG]
			
			exe = "\"" + sublime.packages_path() + "/"+MY_PLUGIN_PATHNAME+"/tool/notification/MacNotifier.sh\""
			exeArray = ["-t", title, "-m", message, "-replaceunderscore", "", ]

			shellParams = {
				SublimeSocketAPISettings.RUNSHELL_MAIN: "/bin/sh",
				exe: exeArray,
				SublimeSocketAPISettings.RUNSHELL_DEBUG: debug
			}
			
			self.runShell(shellParams)



	## get current project's file paths then set results
	def getAllFilePath(self, params, results):
		assert SublimeSocketAPISettings.GETALLFILEPATH_ANCHOR in params, "getAllFilePath require 'anchor' param."

		header = ""
		if SublimeSocketAPISettings.GETALLFILEPATH_HEADER in params:
			header = params[SublimeSocketAPISettings.GETALLFILEPATH_HEADER]

		footer = ""
		if SublimeSocketAPISettings.GETALLFILEPATH_FOOTER in params:
			footer = params[SublimeSocketAPISettings.GETALLFILEPATH_FOOTER]


		anchor = params[SublimeSocketAPISettings.GETALLFILEPATH_ANCHOR]

		self.setWindowBasePath()

		filePath = self.windowBasePath
		if filePath:
			folderPath = os.path.dirname(filePath)
		else:
			results[SublimeSocketAPISettings.GETALLFILEPATH_PATHS] = ""#return empty path
		
		depth = len(filePath.split("/"))-1
		
		basePath_default = "default"
		basePath = basePath_default

		folderPath2 = folderPath

		
		for i in range(depth-1):
			for r,d,f in os.walk(folderPath):

				for files in f:
					if files == anchor:
						basePath = os.path.join(r,files)
						break
						
				if basePath != basePath_default:
					break

			if basePath != basePath_default:
					break

			# not hit, up
			folderPath = os.path.dirname(folderPath)
		

		baseDir = os.path.dirname(basePath)

		pathArray = []
		for r,d,f in os.walk(baseDir):
			for files in f:
				pathArray.append(os.path.join(r,files))

		joinedPathsStr = ','.join(pathArray)

		results[SublimeSocketAPISettings.GETALLFILEPATH_PATHS] = header+joinedPathsStr+footer
		

	def readFileData(self, params, results):
		assert SublimeSocketAPISettings.READFILEDATA_PATH in params, "readFileData require 'path' param."
		
		path = params[SublimeSocketAPISettings.READFILEDATA_PATH]

		currentFile = open(path, 'r')
		data = currentFile.read()
		currentFile.close()

		if not data:
			results[SublimeSocketAPISettings.READFILEDATA_DATA] = ""
		else:
			results[SublimeSocketAPISettings.READFILEDATA_DATA] = data


	def eventEmit(self, params):
		assert SublimeSocketAPISettings.EVENTEMIT_TARGET in params, "eventEmit require 'target' param."
		assert SublimeSocketAPISettings.EVENTEMIT_EVENT in params, "eventEmit require 'event' param."

		eventName = params[SublimeSocketAPISettings.EVENTEMIT_EVENT]
		assert eventName.startswith(SublimeSocketAPISettings.REACTIVE_PREFIX_USERDEFINED_EVENT), "eventEmit only emit 'user-defined' event such as starts with 'event_' keyword."

		self.server.fireKVStoredItem(eventName, params)


	def cancelCompletion(self, params):
		assert SublimeSocketAPISettings.CANCELCOMPLETION_VIEW in params, "cancelCompletion require 'view' param."
		assert SublimeSocketAPISettings.CANCELCOMPLETION_TRIGGER in params, "cancelCompletion require 'trigger' param."

		if params[SublimeSocketAPISettings.CANCELCOMPLETION_TRIGGER] in SublimeSocketAPISettings.CANCELCOMPLETION_TRIGGERS:
			trigger = params[SublimeSocketAPISettings.CANCELCOMPLETION_TRIGGER]

			for case in PythonSwitch(trigger):
				if case(SublimeSocketAPISettings.CANCELCOMPLETION_TRIGGER_BASEREDUCED):
					currentViewSize = params[SublimeSocketAPISettings.CANCELCOMPLETION_VIEW].size()
					completionLockCountDict = self.server.getCurrentCompletingsDict()
					if SublimeSocketAPISettings.RUNCOMPLETION_LOCKCOUNT in completionLockCountDict:
						completionLockCount = completionLockCountDict[SublimeSocketAPISettings.RUNCOMPLETION_LOCKCOUNT]
						if currentViewSize < completionLockCount:
							view = params[SublimeSocketAPISettings.CANCELCOMPLETION_VIEW]
							
							# cancel completion
							def delayed_cancel_complete():
								# cancel completions
								view.run_command("hide_auto_complete")
								
							sublime.set_timeout(delayed_cancel_complete, 1)
							self.prepareCompletion({SublimeSocketAPISettings.PREPARECOMPLETION_ID:"cancelled"})

					break
				if case():
					break

	def prepareCompletion(self, params):
		assert SublimeSocketAPISettings.PREPARECOMPLETION_ID in params, "prepareCompletion require 'id' param."
		self.server.prepareCompletion(params[SublimeSocketAPISettings.PREPARECOMPLETION_ID])

	def runCompletion(self, params):
		assert SublimeSocketAPISettings.RUNCOMPLETION_VIEW in params, "runCompletion require 'view' param."
		assert SublimeSocketAPISettings.RUNCOMPLETION_COMPLETIONS in params, "runCompletion require 'completion' param."
		assert SublimeSocketAPISettings.RUNCOMPLETION_ID in params, "runCompletion require 'id' param."

		identity = params[SublimeSocketAPISettings.RUNCOMPLETION_ID]

		# cancelled
		if self.server.isLoadingCompletion(identity):
			pass
		else:
			return

		completions = params[SublimeSocketAPISettings.RUNCOMPLETION_COMPLETIONS]		

		formatHead = ""
		if SublimeSocketAPISettings.RUNCOMPLETION_FORMATHEAD in params:
			formatHead = params[SublimeSocketAPISettings.RUNCOMPLETION_FORMATHEAD]

		formatTail = ""
		if SublimeSocketAPISettings.RUNCOMPLETION_FORMATTAIL in params:
			formatTail = params[SublimeSocketAPISettings.RUNCOMPLETION_FORMATTAIL]
		
		
		def transformToStr(sourceDict):
			a = formatHead
			b = formatTail
			for key in sourceDict:
				a = a.replace(key, sourceDict[key])
				b = b.replace(key, sourceDict[key])
			
			return (a, b)
			
		completionStrs = list(map(transformToStr, completions))
		
		currentViewPath = params[SublimeSocketAPISettings.RUNCOMPLETION_VIEW]

		view = self.internal_detectViewInstance(currentViewPath)
		if view:
			# memory view size as lockcount. unlock completion when reduce size than this count
			lockcount = view.size()
			
			# set completion
			self.server.updateCompletion(identity, completionStrs, lockcount)
			# display completions
			view.run_command("auto_complete")

	def openPage(self, params):
		assert SublimeSocketAPISettings.OPENPAGE_IDENTITY in params, "openPage require 'identity' param."
		identity = params[SublimeSocketAPISettings.OPENPAGE_IDENTITY]

		host = sublime.load_settings("SublimeSocket.sublime-settings").get('host')
		port = sublime.load_settings("SublimeSocket.sublime-settings").get('port')
		writtenIdentity = identity

		# create path of Preference.html
		currentPackagePath = sublime.packages_path() + "/"+MY_PLUGIN_PATHNAME+"/"
		originalHtmlPath = "resource/html/openpageSource.html"
		originalPath = currentPackagePath + originalHtmlPath

		preferenceFilePath = "tmp/" + identity + ".html"
		preferencePath = currentPackagePath + preferenceFilePath

		# prepare html contents
		htmlFile = open(originalPath, 'r')
		html = htmlFile.read()
		
		htmlFile.close()
		    
		# replace host:port, identity
		html = html.replace(SublimeWSSettings.SS_HOST_REPLACE, host)
		html = html.replace(SublimeWSSettings.SS_PORT_REPLACE, str(port))
		html = html.replace(SublimeWSSettings.SS_IDENTITY_REPLACE, writtenIdentity)

		# generate preference
		outputFile = open(preferencePath, 'w')
		outputFile.write(html)
		outputFile.close()
		
		# set Target-App to open Preference.htnl
		targetAppPath = sublime.load_settings("SublimeSocket.sublime-settings").get('preference browser')

		shellParamDict = {"main":"/usr/bin/open", "-a":targetAppPath, "\"" + preferencePath + "\"":""
		}

		self.runShell(shellParamDict)
		pass

	def setWindowBasePath(self):
		self.windowBasePath = sublime.active_window().active_view().file_name()
		
	## verify SublimeSocket API-version and SublimeSocket version
	def versionVerify(self, params, client):
		assert client, "versionVerify require 'client' object."
		assert SublimeSocketAPISettings.VERSIONVERIFY_SOCKETVERSION in params, "versionVerify require 'socketVersion' param."
		assert SublimeSocketAPISettings.VERSIONVERIFY_APIVERSION in params, "versionVerify require 'apiVersion' param."
		

		# targetted socket version
		targetSocketVersion = int(params[SublimeSocketAPISettings.VERSIONVERIFY_SOCKETVERSION])

		# targetted API version
		targetVersion = params[SublimeSocketAPISettings.VERSIONVERIFY_APIVERSION]
		

		# current socket version
		currentSocketVersion = SublimeSocketAPISettings.SOCKET_VERSION

		# current API version
		currentVersion			= SublimeSocketAPISettings.API_VERSION


		# check socket version
		if targetSocketVersion is not currentSocketVersion:
			self.sendVerifiedResultMessage(0, targetSocketVersion, SublimeSocketAPISettings.SOCKET_VERSION, targetVersion, currentVersion, client)
			return

		# SublimeSocket version matched.

		# check socket versipn
		targetVersionArray = targetVersion.split(".")

		targetMajor	= int(targetVersionArray[0])
		targetMinor	= int(targetVersionArray[1])
		# targetPVer	= int(targetVersionArray[2])

		
		currentVersionArray = currentVersion.split(".")

		currentMajor	= int(currentVersionArray[0])
		currentMinor	= int(currentVersionArray[1])
		# currentPVer		= int(currentVersionArray[2])

		# major chedk
		if targetMajor < currentMajor:
			self.sendVerifiedResultMessage(-2, targetSocketVersion, SublimeSocketAPISettings.SOCKET_VERSION, targetVersion, currentVersion, client)

		elif targetMajor == currentMajor:
			if targetMinor < currentMinor:
				self.sendVerifiedResultMessage(2, targetSocketVersion, SublimeSocketAPISettings.SOCKET_VERSION, targetVersion, currentVersion, client)
			elif targetMinor == currentMinor:
				self.sendVerifiedResultMessage(1, targetSocketVersion, SublimeSocketAPISettings.SOCKET_VERSION, targetVersion, currentVersion, client)
			else:
				self.sendVerifiedResultMessage(-1, targetSocketVersion, SublimeSocketAPISettings.SOCKET_VERSION, targetVersion, currentVersion, client)
				
		else:
			self.sendVerifiedResultMessage(-1, targetSocketVersion, SublimeSocketAPISettings.SOCKET_VERSION, targetVersion, currentVersion, client)
	## send result to client then exit or continue WebSocket connection.
	def sendVerifiedResultMessage(self, resultCode, targetSocketVersion, currentSocketVersion, targetAPIVersion, currentAPIVersion, client):
		# python-switch
		for case in PythonSwitch(resultCode):
			if case(0):
				message = "REFUSED/DIFFERENT_SUBLIMESOCKET:	The current running SublimeSocket version = "+str(currentSocketVersion)+", please choose the other version of SublimeSocket. this client requires SublimeSocket "+str(targetSocketVersion)+", see https://github.com/sassembla/SublimeSocket"
				buf = self.encoder.text(message, mask=0)
				client.send(buf);

				client.close()
				self.server.deleteClientId(client.clientId)
			
				break
			if case(1):
				message = "VERIFIED:	The current running SublimeSocket api version = "+currentAPIVersion+", SublimeSocket "+str(currentSocketVersion)
				buf = self.encoder.text(message, mask=0)
				client.send(buf)
				break
			if case(2):
				message = "VERIFIED/CLIENT_UPDATE: The current running SublimeSocket api version = "+currentAPIVersion+", this client requires api version = "+str(targetAPIVersion)+", please update this client if possible."
				buf = self.encoder.text(message, mask=0)
				client.send(buf);
				break

			if case(-1):
				message = "REFUSED/SUBLIMESOCKET_UPDATE:	The current running SublimeSocket api version = "+currentAPIVersion+", this is out of date. please update SublimeSocket. this client requires SublimeSocket "+str(targetAPIVersion)+", see https://github.com/sassembla/SublimeSocket"
				buf = self.encoder.text(message, mask=0)
				client.send(buf);

				client.close()
				self.server.deleteClientId(client.clientId)
				break

			if case(-2):
				message = "REFUSED/CLIENT_UPDATE:	The current running SublimeSocket api version = "+currentAPIVersion+", this client requires api version = "+str(targetAPIVersion)+", required api version is too old. please update this client."
				buf = self.encoder.text(message, mask=0)
				client.send(buf);

				client.close()
				self.server.deleteClientId(client.clientId)
				break
		print("ss: " + message)

	def checkIfViewExist_appendRegion_Else_notFound(self, view, viewInstance, line, message, condition):
		# this check should be run in main thread
		if not viewInstance:
			params = {}
			params[SublimeSocketAPISettings.NOVIEWFOUND_TARGET] = SublimeSocketAPISettings.FOUNDATIONREACTOR_TARGET_DEFAULT
			params[SublimeSocketAPISettings.NOVIEWFOUND_VIEW] = view
			params[SublimeSocketAPISettings.NOVIEWFOUND_LINE] = line
			params[SublimeSocketAPISettings.NOVIEWFOUND_MESSAGE] = message
			params[SublimeSocketAPISettings.NOVIEWFOUND_CONDITION] = condition

			self.server.fireKVStoredItem(SublimeSocketAPISettings.SS_FOUNDATION_NOVIEWFOUND, params)
			return

		self.internal_appendRegion(viewInstance, line, message, condition)

	def internal_appendRegion(self, viewInstance, line, message, condition):
		lines = []
		regions = []
		point = self.getLineCount_And_SetToArray(viewInstance, line, lines)
		regions.append(viewInstance.line(point))

		identity = SublimeSocketAPISettings.REGION_UUID_PREFIX + str(regions[0])
		
		# show
		viewInstance.add_regions(identity, regions, condition, 'dot', sublime.DRAW_OUTLINED)

		# store region
		self.server.storeRegionToView(viewInstance, identity, regions[0], line, message)


	### region control


	## erase all regions of view/condition
	def eraseAllRegion(self):
		self.server.deleteAllRegionsInAllView()
		

	## evaluate strings
	# Not only eval.
	# Set environment parameters from reading KVS
	def sublimeEval(self, params, client=None):
		# print("params", params, "client", client)
		# SUBLIME series
		# sublime.Region
		# sublime.status_message("can you see me?")
		# sublime.message_dialog("new connection approaching")
		# sublime.ok_cancel_dialog
		# sublime.load_settings
		# sublime.save_settings
		# sublime.windows()	#[<sublime.Window object at 0x115f11d70>]
		# sublime.active_window() #<sublime.Window object at 0x115f11d70>
		# sublime.packages_path() #/Users/sassembla/Library/Application Support/Sublime Text 2/Packages
		# sublime.installed_packages_path() #/Users/sassembla/Library/Application Support/Sublime Text 2/Installed Packages
		# sublime.get_clipboard() 
		# sublime.set_clipboard("hereComesDaredevil") 
		# score_selector
		# run_command
		# log_commands
		# log_input
		# version
		# platform
		# arch

		# WINDOW series
		active_window = sublime.active_window()

		# id()	
		# new_file()	
		# open_file(file_name, <flags>)	View	
		# active_view() #<sublime.View object at 0x10b768a60>
		# active_view_in_group(group)	View	Returns the currently edited view in the given group.
		# views()	[View]	Returns all open views in the window.
		# views_in_group(group)	[View]	Returns all open views in the given group.
		# num_groups()	int	Returns the number of view groups in the window.
		# active_group()	int	Returns the index of the currently selected group.
		# focus_group(group)	None	Makes the given group active.
		# focus_view(view)	None	Switches to the given view.
		# get_view_index(view)	(group, index)	Returns the group, and index within the group of the view. Returns -1 if not found.
		# set_view_index(view, group, index)	None	Moves the view to the given group and index.
		# folders()	[String]	Returns a list of the currently open folders.
		# run_command(string, <args>)	None	Runs the named WindowCommand with the (optional) given arguments.
		# show_quick_panel(items, on_done, <flags>)	None	Shows a quick panel, to select an item in a list. on_done will be called once, with the index of the selected item. If the quick panel was cancelled, on_done will be called with an argument of -1.
		# show_input_panel(caption, initial_text, on_done, on_change, on_cancel)	View	Shows the input panel, to collect a line of input from the user. on_done and on_change, if not None, should both be functions that expect a single string argument. on_cancel should be a function that expects no arguments. The view used for the input widget is returned.
		# get_output_panel(name)


		# VIEW series
		active_view = active_window.active_view()
		
		# id()	int	Returns a number that uniquely identifies this view.
		# buffer_id()	int	Returns a number that uniquely identifies the buffer underlying this view.
		# file_name()	String	The full name file the file associated with the buffer, or None if it doesn't exist on disk.
		# name()	String	The name assigned to the buffer, if any
		# set_name(name)	None	Assigns a name to the buffer
		# is_loading()	bool	Returns true if the buffer is still loading from disk, and not ready for use.
		# is_dirty()	bool	Returns true if there are any unsaved modifications to the buffer.
		# is_read_only()	bool	Returns true if the buffer may not be modified.
		# set_read_only(value)	None	Sets the read only property on the buffer.
		# is_scratch()	bool	Returns true if the buffer is a scratch buffer. Scratch buffers never report as being dirty.
		# set_scratch(value)	None	Sets the scratch property on the buffer.
		# settings()	Settings	Returns a reference to the views settings object. Any changes to this settings object will be private to this view.
		# window()	Window	Returns a reference to the window containing the view.
		# run_command(string, <args>)	None	Runs the named TextCommand with the (optional) given arguments.
		# size()	int	Returns the number of character in the file.
		# substr(region)	String	Returns the contents of the region as a string.
		# substr(point)	String	Returns the character to the right of the point.
		# begin_edit(<command>, <args>)	Edit	Creates an edit object, demarcating an undo group. A corresponding call to end_edit() is required.
		# end_edit(edit)	Edit	Finishes the edit.
		# insert(edit, point, string)	int	Inserts the given string in the buffer at the specified point. Returns the number of characters inserted: this may be different if tabs are being translated into spaces in the current buffer.
		# erase(edit, region)	None	Erases the contents of the region from the buffer.
		# replace(edit, region, string)	None	Replaces the contents of the region with the given string.
		# sel()	RegionSet	Returns a reference to the selection.
		# line(point)	Region	Returns the line that contains the point.
		# line(region)	Region	Returns a modified copy of region such that it starts at the beginning of a line, and ends at the end of a line. Note that it may span several lines.
		# full_line(point)	Region	As line(), but the region includes the trailing newline character, if any.
		# full_line(region)	Region	As line(), but the region includes the trailing newline character, if any.
		# lines(region)	[Region]	Returns a list of lines (in sorted order) intersecting the region.
		# split_by_newlines(region)	[Region]	Splits the region up such that each region returned exists on exactly one line.
		# word(point)	Region	Returns the word that contains the point.
		# word(region)	Region	Returns a modified copy of region such that it starts at the beginning of a word, and ends at the end of a word. Note that it may span several words.
		# find(pattern, fromPosition, <flags>)	Region	Returns the first Region matching the regex pattern, starting from the given point, or None if it can't be found. The optional flags parameter may be sublime.LITERAL, sublime.IGNORECASE, or the two ORed together.
		# find_all(pattern, <flags>, <format>, <extractions>)	[Region]	Returns all (non-overlapping) regions matching the regex pattern. The optional flags parameter may be sublime.LITERAL, sublime.IGNORECASE, or the two ORed together. If a format string is given, then all matches will be formatted with the formatted string and placed into the extractions list.
		# rowcol(point)	(int, int)	Calculates the 0 based line and column numbers of the point.
		# text_point(row, col)	int	Calculates the character offset of the given, 0 based, row and column. Note that 'col' is interpreted as the number of characters to advance past the beginning of the row.
		# set_syntax_file(syntax_file)	None	Changes the syntax used by the view. syntax_file should be a name along the lines of Packages/Python/Python.tmLanguage. To retrieve the current syntax, use view.settings().get('syntax').
		# extract_scope(point)	Region	Returns the extent of the syntax name assigned to the character at the given point.
		# scope_name(point)	String	Returns the syntax name assigned to the character at the given point.
		# score_selector(point, selector)	Int	Matches the selector against the scope at the given location, returning a score. A score of 0 means no match, above 0 means a match. Different selectors may be compared against the same scope: a higher score means the selector is a better match for the scope.
		# find_by_selector(selector)	[Regions]	Finds all regions in the file matching the given selector, returning them as a list.
		# show(point, <show_surrounds>)	None	Scroll the view to show the given point.
		# show(region, <show_surrounds>)	None	Scroll the view to show the given region.
		# show(region_set, <show_surrounds>)	None	Scroll the view to show the given region set.
		# show_at_center(point) 
		# show_at_center(region)	None	Scroll the view to center on the region.
		# visible_region()	Region	Returns the currently visible area of the view.
		# viewport_position()#	(0.0, 646.0) Vector	Returns the offset of the viewport in layout coordinates.
		# set_viewport_position(vector, <animate<)	None	Scrolls the viewport to the given layout position.
		# viewport_extent()	vector	Returns the width and height of the viewport.
		# layout_extent()	vector	Returns the width and height of the layout.
		# text_to_layout(point)	vector	Converts a text position to a layout position
		# layout_to_text(vector)	point	Converts a layout position to a text position
		# line_height()	real	Returns the light height used in the layout
		# em_width()	real	Returns the typical character width used in the layout
		# add_regions("hereC", regions, "comment")	 comment以外にもアイコンとかも有る
		# get_regions(key)	[regions]	Return the regions associated with the given key, if any
		# erase_regions(key)	None	Removed the named regions
		# set_status(key, value)	None	Adds the status key to the view. The value will be displayed in the status bar, in a comma separated list of all status values, ordered by key. Setting the value to the empty string will clear the status.
		# get_status(key)	String	Returns the previously assigned value associated with the key, if any.
		# erase_status(key)	None	Clears the named status.
		# command_history(index, <modifying_only>)	(String,Dict,int)	Returns the command name, command arguments, and repeat count for the given history entry, as stored in the undo / redo stack.
		# fold([regions])	bool	Folds the given regions, returning False if they were already folded
		# fold(region)	bool	Folds the given region, returning False if it was already folded
		# unfold(region)	[regions]	Unfolds all text in the region, returning the unfolded regions
		# unfold([regions])	[regions]	Unfolds all text in the regions, returning the unfolded regions
		# encoding()	String	Returns the encoding currently associated with the file
		# set_encoding(encoding)	None	Applies a new encoding to the file. This encoding will be used the next time the file is saved.
		# line_endings()	String	Returns the line endings used by the current file.
		# set_line_endings(line_endings)	None	Sets the line endings that will be applied when next saving.


		# REGIONSET series
		# clear()	None	Removes all regions.
		# add(region)	None	Adds the given region. It will be merged with any intersecting regions already contained within the set.
		# add_all(region_set)	None	Adds all regions in the given set.
		# subtract(region)	None	Subtracts the region from all regions in the set.
		# contains(region)	bool	Returns true iff the given region is a subset.


		# REGION series
		regions = []

		# region = sublime.Region(100,200)
		# begin()	int	Returns the minimum of a and b.
		# end()	int	Returns the maximum of a and b.
		# size()	int	Returns the number of characters spanned by the region. Always >= 0.
		# empty()	bool	Returns true iff begin() == end().
		# cover(region)	Region	Returns a Region spanning both this and the given regions.
		# intersection(region)	Region	Returns the set intersection of the two regions.
		# intersects(region)	bool	Returns True iff this == region or both include one or more positions in common.
		# contains(region)	bool	Returns True iff the given region is a subset.
		# contains(point)


		# SETTING series
		# get(name)	value	Returns the named setting.
		# get(name, default)	value	Returns the named setting, or default if it's not defined.
		# set(name, value)	None	Sets the named setting. Only primitive types, lists, and dictionaries are accepted.
		# erase(name)	None	Removes the named setting. Does not remove it from any parent Settings.
		# has(name)	bool	Returns true iff the named option exists in this set of Settings or one of its parents.
		# add_on_change(key, on_change)	None	Register a callback to be run whenever a setting in this object is changed.
		# clear_on_change(key)	None	Remove all callbacks registered with the given key.
		

		# ## SPECIAL DEFINES ##
		# The "eval" cannot  create values. Use these params as "you defined these params".
		lines = []

		# EVENTLISTENER and the other Base Class series ...no needs

		### EVALUATE ###
		results = []
		for executable in params:
			print(executable)
			result = eval(executable)
			if result == None:
				result = "None"
			results.append(executable+" = "+str(result)+"	/")

		
		if (client):
			buf = self.encoder.text(str("".join(results)), mask=0)
			client.send(buf)
		
	## change lineCount to wordCount that is, includes the target-line index at SublimeText.
	def getLineCount_And_SetToArray(self, view, lineCount, lineArray):
		assert view is not None, "view should not be None."
		#check the namespace of inputted param
		len(lineArray)

		# Convert from 1 based to a 0 based line number
		line = int(lineCount) - 1
		# print "line	", line

		# Negative line numbers count from the end of the buffer
		if line < 0:
			lines, _ = view.rowcol(view.size())
			line = lines + line + 1
		pt = view.text_point(line, 0)

		#store params to local param.
		lineArray.append(pt)
		return pt

	## print message to console
	def printout(self, message):
		print("debug_message:", message)


		



