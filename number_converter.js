!function(f){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=f();else if("function"==typeof define&&define.amd)define([],f);else{var g;g="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,g.number_converter=f()}}(function(){return function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){return o(e[i][1][r]||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r}()({1:[function(require,module,exports){function getMapperForType(type,options){var mapper=null;switch(type=type&&type.toUpperCase()){case NumberConverter.ROMAN_NUMERAL:mapper=new RomanNumeralMapper;break;case NumberConverter.BINARY:mapper=new BaseNNumberMapper(2,options);break;case NumberConverter.OCTAL:mapper=new BaseNNumberMapper(8,options);break;case NumberConverter.DECIMAL:mapper=new BaseNNumberMapper(10,options);break;case NumberConverter.HEXADECIMAL:mapper=new BaseNNumberMapper(16,options);break;case NumberConverter.SCIENTIFIC_NOTATION:mapper=new ScientificNotationMapper;break;default:mapper=new BaseNNumberMapper(10,options)}return mapper}var ScientificNotationMapper=require("./mappers/ScientificNotationMapper"),BaseNNumberMapper=require("./mappers/BaseNNumberMapper"),RomanNumeralMapper=require("./mappers/RomanNumeralMapper"),NumberConverter=function(fromType,toType,options){"string"!=typeof toType&&(options=toType,toType=fromType,fromType=null),this._fromMapper=getMapperForType(fromType,options),this._toMapper=getMapperForType(toType,options)};NumberConverter.prototype.convert=function(number){var intermediateDecimal=this._fromMapper.toDecimal(number);return this._toMapper.fromDecimal(intermediateDecimal)},NumberConverter.prototype.deconvert=function(number){var intermediateDecimal=this._toMapper.toDecimal(number);return this._fromMapper.fromDecimal(intermediateDecimal)},NumberConverter.ROMAN_NUMERAL="ROMAN",NumberConverter.BINARY="BINARY",NumberConverter.OCTAL="OCTAL",NumberConverter.DECIMAL="DECIMAL",NumberConverter.HEXADECIMAL="HEXADECIMAL",NumberConverter.SCIENTIFIC_NOTATION="SCIENTIFIC",module.exports=NumberConverter},{"./mappers/BaseNNumberMapper":3,"./mappers/RomanNumeralMapper":5,"./mappers/ScientificNotationMapper":6}],2:[function(require,module,exports){function ValueError(message){this.name="ValueError",this.message=message||"Variable contains an invalid value",this.stack=(new Error).stack}ValueError.prototype=Object.create(Error.prototype),ValueError.prototype.constructor=ValueError,module.exports=ValueError},{}],3:[function(require,module,exports){function convertNumberToDecimal(numberStr,fromBase){var parts=numberStr.split("."),integerPart=parts[0],decimalNumber=convertIntegerPartToDecimal(integerPart,fromBase);if(this._allowFractionalBaseN){decimalNumber+=convertFractionalPartToDecimal(parts[1],fromBase)}return decimalNumber}function convertNumberFromDecimal(numberStr,toBase){var decimalNumber=parseFloat(numberStr),integerPart=Math.floor(decimalNumber),fractionalPart=decimalNumber-integerPart,result=convertIntegerPartToBaseN(integerPart,toBase);if(this._allowFractionalBaseN){var fractionalResult=convertFractionalPartToBaseN(fractionalPart,toBase);fractionalResult&&(result+="."+fractionalResult)}return result}function convertIntegerPartToDecimal(integerPart,fromBase){for(var result=0,i=0;i<integerPart.length;i++){var placeValue=Math.pow(fromBase,integerPart.length-1-i),currChar=integerPart.charAt(i);result+=placeValue*BASE_CHARACTERS.indexOf(currChar)}return result}function convertFractionalPartToDecimal(fractionalPart,fromBase){for(var result=0,i=0;i<fractionalPart.length;i++){var placeValue=Math.pow(fromBase,-i-1),currChar=fractionalPart.charAt(i);result+=placeValue*BASE_CHARACTERS.indexOf(currChar)}return result}function convertIntegerPartToBaseN(integerPart,toBase){for(var result="",currPlaceValue=1;currPlaceValue<=integerPart/toBase;)currPlaceValue*=toBase;for(;currPlaceValue>=1;){var quotient=Math.floor(integerPart/currPlaceValue),remainder=integerPart%currPlaceValue;result+=BASE_CHARACTERS.charAt(quotient),integerPart=remainder,currPlaceValue/=toBase}return result}function convertFractionalPartToBaseN(fractionalPart,toBase){for(var currPlaceValue,result="",exponent=-1;fractionalPart>FRACTIONAL_TOLERANCE;){currPlaceValue=Math.pow(toBase,exponent);var char="0";if(currPlaceValue<=fractionalPart){var quotient=Math.floor(fractionalPart/currPlaceValue);char=BASE_CHARACTERS.charAt(quotient),fractionalPart-=currPlaceValue*quotient}result+=char,exponent--}return result}function parseOptions(options){options=options||{},this._allowFractionalBaseN=options.fractionalBaseN||!1}var MapperBase=require("./MapperBase"),validation=require("../validation/baseNNumberValidation"),baseNNumberUtils=require("../utils/baseNNumberUtils"),commonUtils=require("../utils/commonUtils"),inherit=commonUtils.inherit,BASE_CHARACTERS=baseNNumberUtils.BASE_CHARACTERS,FRACTIONAL_TOLERANCE=Math.pow(10,-6),BaseNNumberMapper=function(numberBase,options){"number"==typeof numberBase?validation.validateBase(numberBase):(options=numberBase,numberBase=null),this._super.apply(this,[options]),parseOptions.call(this,options),this._numberBase=numberBase||10};inherit(BaseNNumberMapper,MapperBase),BaseNNumberMapper.prototype.fromDecimal=function(number){if(number=this._superProto.fromDecimal.apply(this,arguments),validation.validateDecimalNumber(number),10===this._numberBase)return number;var numberStr=commonUtils.convertNumberTypeToString(number);return convertNumberFromDecimal.call(this,numberStr,this._numberBase)},BaseNNumberMapper.prototype.toDecimal=function(number){if(!(number=this._superProto.toDecimal.apply(this,arguments)))return 0;if(validation.validateBaseNNumber(number,this._numberBase),10===this._numberBase)return number;var numberStr=commonUtils.convertNumberTypeToString(number);return convertNumberToDecimal.call(this,numberStr,this._numberBase)},module.exports=BaseNNumberMapper},{"../utils/baseNNumberUtils":7,"../utils/commonUtils":8,"../validation/baseNNumberValidation":10,"./MapperBase":4}],4:[function(require,module,exports){var commonValidation=require("../validation/commonValidation"),MapperBase=function(){};MapperBase.prototype.fromDecimal=function(number){return commonValidation.validateDecimalNumber(number),number},MapperBase.prototype.toDecimal=function(otherValue){return otherValue},module.exports=MapperBase},{"../validation/commonValidation":11}],5:[function(require,module,exports){function appendAdditiveNumerals(numeralMapping){for(var numeralCount=0;numeralCount<MAX_ADDITIVE_NUMERAL_COUNT&&this._number>=numeralMapping.number;)this._numerals+=numeralMapping.numeral,this._number-=numeralMapping.number,numeralCount+=1}function appendNumeralsRequiringSubtraction(numeralMapping){appendNumeralsWithOneTenthSubtraction.call(this,numeralMapping),appendNumeralsWithOneFifthSubtraction.call(this,numeralMapping)}function processNextNumerals(numeralPos){var twoNumeralsProcessed=!1,numeralMapping=getNumeralMappingForNumeralAtPosition.call(this,numeralPos),nextNumeralMapping=getNumeralMappingForNumeralAtPosition.call(this,numeralPos+1);return nextNumeralMapping&&nextNumeralMapping.number>numeralMapping.number?(this._number+=nextNumeralMapping.number-numeralMapping.number,twoNumeralsProcessed=!0):this._number+=numeralMapping.number,twoNumeralsProcessed}function appendNumeralsWithOneTenthSubtraction(numeralMapping){if(this._number>=9*numeralMapping.number/10&&isNumberPowerOfTen(numeralMapping.number)){var oneTenthMapping=mappingsByNumber[numeralMapping.number/10];this._numerals+=oneTenthMapping.numeral+numeralMapping.numeral,this._number-=numeralMapping.number-oneTenthMapping.number}}function appendNumeralsWithOneFifthSubtraction(numeralMapping){if(this._number>=4*numeralMapping.number/5){var oneFifthMapping=mappingsByNumber[numeralMapping.number/5];oneFifthMapping&&(this._numerals+=oneFifthMapping.numeral+numeralMapping.numeral,this._number-=numeralMapping.number-oneFifthMapping.number)}}function sanitizeNumber(number){return number=parseInt(number)}function sanitizeNumerals(numerals){return"string"==typeof numerals&&(numerals=numerals.toUpperCase()),numerals}function isNumberPowerOfTen(number){for(;number>1;)if(1===(number/=10))return!0;return!1}function getNumeralMappingForNumeralAtPosition(numeralPos){var numeralMapping=null;if(numeralPos<this._numerals.length){var numeralChar=this._numerals.charAt(numeralPos);numeralMapping=mappingsByNumeral[numeralChar]}return numeralMapping}var MapperBase=require("./MapperBase"),validation=require("../validation/romanNumeralValidation"),romanNumeralUtils=require("../utils/romanNumeralUtils"),commonUtils=require("../utils/commonUtils"),inherit=commonUtils.inherit,MAX_ADDITIVE_NUMERAL_COUNT=3,MAPPINGS=romanNumeralUtils.getNumeralMappings(),mappingsByNumber=romanNumeralUtils.getMappingsByNumber(),mappingsByNumeral=romanNumeralUtils.getMappingsByNumeral(),RomanNumeralMapper=function(){this._super.apply(this,arguments),this._numerals="",this._number=0};inherit(RomanNumeralMapper,MapperBase),RomanNumeralMapper.prototype.fromDecimal=function(number){this._number=this._superProto.fromDecimal.call(this,number),this._number=sanitizeNumber(this._number),this._numerals="",validation.validateDecimalNumber(this._number);for(var i=0;i<MAPPINGS.length;i++){var numeralMapping=MAPPINGS[i];appendAdditiveNumerals.call(this,numeralMapping),appendNumeralsRequiringSubtraction.call(this,numeralMapping)}return this._numerals},RomanNumeralMapper.prototype.toDecimal=function(numerals){this._numerals=this._superProto.toDecimal.call(this,numerals),this._numerals=sanitizeNumerals(this._numerals),this._number=0,validation.validateRomanNumerals(this._numerals);for(var i=0;i<this._numerals.length;i++){processNextNumerals.call(this,i)&&i++}return this._number},module.exports=RomanNumeralMapper},{"../utils/commonUtils":8,"../utils/romanNumeralUtils":9,"../validation/romanNumeralValidation":12,"./MapperBase":4}],6:[function(require,module,exports){function convertDecimalToScientificNotation(){var digitCount=countDigits(this._coefficient);return determineCoefficientAndExponent.call(this),formatCoefficient(this._coefficient,digitCount)+"e"+this._exponent}function determineCoefficientAndExponent(){if(this._coefficient=convertStringTypeToNumber(this._coefficient),this._coefficient){for(;this._coefficient>=10||this._coefficient<=-10;)this._coefficient=this._coefficient/10,this._exponent++;for(;this._coefficient<1&&this._coefficient>-1;)this._coefficient=10*this._coefficient,this._exponent--}}function formatCoefficient(coefficient,digitCount){var coefficientStr=commonUtils.convertNumberTypeToString(coefficient);coefficientStr=stripZerosFromEnds(coefficientStr);for(var result="",i=0;i<coefficientStr.length&&digitCount>0;i++){var char=coefficientStr.charAt(i);isDigit(char)&&digitCount--,result+=char}return result}function countDigits(number){var digitCount=0,numberStr=commonUtils.convertNumberTypeToString(number);numberStr=stripZerosFromEnds(numberStr);for(var i=0;i<numberStr.length;i++)isDigit(numberStr.charAt(i))&&digitCount++;return digitCount}function convertStringTypeToNumber(numberStr){return"string"==typeof numberStr?parseFloat(numberStr):numberStr}function stripZerosFromEnds(numberStr){return numberStr=numberStr.replace(/^(-)?0+/,"$1"),(numberStr=numberStr.replace(/\.?0+$/,""))||"0"}function removeWhitespace(numberStr){return numberStr.replace(/\s/g,"")}function isDigit(char){return DIGITS.indexOf(char)>-1}var MapperBase=require("./MapperBase"),commonUtils=require("../utils/commonUtils"),inherit=commonUtils.inherit,DIGITS="0123456789",SN_REGEX=/^\+?(-?[\d\.]+)[e|x|\*](?:10\^|10\*\*)?\+?(-?\d+)$/i,ScientificNotationMapper=function(){this._super.apply(this,arguments),this._exponent=0,this._coefficient=0};inherit(ScientificNotationMapper,MapperBase),ScientificNotationMapper.prototype.fromDecimal=function(number){return this._coefficient=this._superProto.fromDecimal.call(this,number),this._exponent=0,convertDecimalToScientificNotation.call(this)},ScientificNotationMapper.prototype.toDecimal=function(sNotation){this._superProto.toDecimal.apply(this,arguments),this._exponent=this._coefficient=0,sNotation=removeWhitespace(sNotation);var snParts=SN_REGEX.exec(sNotation);return this._coefficient=parseFloat(snParts[1]),this._exponent=parseInt(snParts[2]),this._coefficient*Math.pow(10,this._exponent)},module.exports=ScientificNotationMapper},{"../utils/commonUtils":8,"./MapperBase":4}],7:[function(require,module,exports){module.exports={BASE_CHARACTERS:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"}},{}],8:[function(require,module,exports){var convertNumberTypeToString=function(number){return number="number"==typeof number?number.toString():number},inherit=function(childCtor,parentCtor){childCtor.prototype=Object.create(parentCtor.prototype),childCtor.prototype.constructor=childCtor,childCtor.prototype._super=parentCtor,childCtor.prototype._superProto=parentCtor.prototype};module.exports={convertNumberTypeToString:convertNumberTypeToString,inherit:inherit}},{}],9:[function(require,module,exports){var MAPPINGS=[{number:1e3,numeral:"M"},{number:500,numeral:"D"},{number:100,numeral:"C"},{number:50,numeral:"L"},{number:10,numeral:"X"},{number:5,numeral:"V"},{number:1,numeral:"I"}],mappingsByNumber={},mappingsByNumeral={},getNumeralMappings=function(){for(var result=[],i=0;i<MAPPINGS.length;i++)result.push(cloneSimpleObject(MAPPINGS[i]));return result},getMappingsByNumber=function(){return cloneSimpleObject(mappingsByNumber)},getMappingsByNumeral=function(){return cloneSimpleObject(mappingsByNumeral)},cloneSimpleObject=function(obj){var clone={};for(var prop in obj)obj.hasOwnProperty(prop)&&(clone[prop]=obj[prop]);return clone};!function(){for(var i=0;i<MAPPINGS.length;i++){var mapping=MAPPINGS[i];mappingsByNumber[mapping.number]=mapping,mappingsByNumeral[mapping.numeral]=mapping}}(),module.exports={getNumeralMappings:getNumeralMappings,getMappingsByNumber:getMappingsByNumber,getMappingsByNumeral:getMappingsByNumeral}},{}],10:[function(require,module,exports){var ValueError=require("../errors/ValueError"),baseNNumberUtils=require("../utils/baseNNumberUtils"),commonUtils=require("../utils/commonUtils"),BASE_CHARACTERS=baseNNumberUtils.BASE_CHARACTERS,MAX_NUMBER_BASE=BASE_CHARACTERS.length,validateBase=function(numberBase){validateBaseRange(numberBase)},validateDecimalNumber=function(number){var numberStr=commonUtils.convertNumberTypeToString(number);validateNumberIsNotNegative(numberStr)},validateBaseNNumber=function(number,base){var numberStr=commonUtils.convertNumberTypeToString(number);validateNumberIsNotNegative(numberStr),validateCharactersAreValid(numberStr),validateCharactersAreValidForBase(numberStr,base)},validateBaseRange=function(numberBase){if(numberBase<2||numberBase>MAX_NUMBER_BASE)throw new RangeError("Number base must be between 2 and "+MAX_NUMBER_BASE+" (found "+numberBase+")")},validateNumberIsNotNegative=function(numberStr){if(numberStr.length>0&&"-"===numberStr.charAt(0))throw new RangeError("Number cannot be negative ("+numberStr+")")},validateCharactersAreValid=function(numberStr){for(var i=0;i<numberStr.length;i++){var char=numberStr.charAt(i);if(-1===BASE_CHARACTERS.indexOf(char)&&"."!==char)throw new ValueError(char+" is not a valid character")}},validateCharactersAreValidForBase=function(numberStr,numberBase){for(var i=0;i<numberStr.length;i++){var char=numberStr.charAt(i);if(BASE_CHARACTERS.indexOf(char)>=numberBase)throw new ValueError("Base "+numberBase+" number cannot contain "+char)}};module.exports={validateBase:validateBase,validateDecimalNumber:validateDecimalNumber,validateBaseNNumber:validateBaseNNumber}},{"../errors/ValueError":2,"../utils/baseNNumberUtils":7,"../utils/commonUtils":8}],11:[function(require,module,exports){var validateDecimalNumber=function(number){validateNumberIsIntegerParsable(number)},validateNumberIsIntegerParsable=function(number){if(!isParsableAsInteger(number))throw new TypeError("Number must be of type number ("+typeof number+" provided)")},isParsableAsInteger=function(number){var isNumberType="number"==typeof number,isStringContainingNumber="string"==typeof number&&!isNaN(number);return isNumberType||isStringContainingNumber};module.exports={validateDecimalNumber:validateDecimalNumber}},{}],12:[function(require,module,exports){var ValueError=require("../errors/ValueError"),romanNumeralUtils=require("../utils/romanNumeralUtils"),mappingsByNumeral=romanNumeralUtils.getMappingsByNumeral(),validateDecimalNumber=function(number){validateDecimalNumberRange(number)},validateRomanNumerals=function(numerals){validateRomanNumeralIsString(numerals),validateRomanNumeralValidCharacters(numerals),validateRomanNumeralCharacterRuns(numerals),validateRomanNumeralSubtractionFactor(numerals),validateRomanNumeralHalfSubtraction(numerals),validateRomanNumeralMultipleHalfNumeralsInRun(numerals)},validateDecimalNumberRange=function(number){if(number<1||number>3999)throw new RangeError("Number must be between 1 and 3999 (inclusive)")},validateRomanNumeralIsString=function(numerals){if("string"!=typeof numerals)throw new TypeError("Roman numerals must be of type string ("+typeof numerals+" provided)")},validateRomanNumeralValidCharacters=function(numerals){for(var i=0;i<numerals.length;i++){var numeral=numerals.charAt(i);if(!mappingsByNumeral[numeral])throw new ValueError('Numerals string must contain only valid roman numerals (contained "'+numeral+'")')}},validateRomanNumeralCharacterRuns=function(numerals){for(var lastNumeral=null,lastNumeralCount=0,i=0;i<numerals.length;i++){var numeral=numerals.charAt(i);if(numeral===lastNumeral?lastNumeralCount++:(lastNumeral=numeral,lastNumeralCount=1),lastNumeralCount>3)throw new ValueError('Numerals string must not contain 4 "'+lastNumeral+'"s in a row')}},validateRomanNumeralSubtractionFactor=function(numerals){for(var i=0;i<numerals.length-1;i++){var mapping=mappingsByNumeral[numerals.charAt(i)],nextMapping=mappingsByNumeral[numerals.charAt(i+1)];if(nextMapping.number/mapping.number>10)throw new ValueError("Numerals string cannot directly subtract "+mapping.numeral+" from "+nextMapping.numeral+" (maximum factor of 10)")}},validateRomanNumeralHalfSubtraction=function(numerals){for(var i=0;i<numerals.length-1;i++){var mapping=mappingsByNumeral[numerals.charAt(i)],nextMapping=mappingsByNumeral[numerals.charAt(i+1)];if(mapping.number<nextMapping.number&&numberStartsWithFive(mapping.number))throw new ValueError("Numerals string cannot subtract numbers starting with 5 (found "+mapping.numeral+nextMapping.numeral+")")}},validateRomanNumeralMultipleHalfNumeralsInRun=function(numerals){for(var i=0;i<numerals.length-1;i++){var mapping=mappingsByNumeral[numerals.charAt(i)],nextMapping=mappingsByNumeral[numerals.charAt(i+1)];if(mapping.number===nextMapping.number&&numberStartsWithFive(mapping.number))throw new ValueError("Numerals string cannot have multiple numbers starting with 5 in a row")}},numberStartsWithFive=function(number){for(;number>10;)number/=10;return 5===number};module.exports={validateDecimalNumber:validateDecimalNumber,validateRomanNumerals:validateRomanNumerals}},{"../errors/ValueError":2,"../utils/romanNumeralUtils":9}],13:[function(require,module,exports){exports.NumberConverter=require("./NumberConverter")},{"./NumberConverter":1}]},{},[13])(13)});