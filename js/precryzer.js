var fields = [];
var serviceName = "save_something";
var formId = "formId";
var object = "Object";

function assigmentCodeJquery(field) {
    variablesCode = "";
    variablesCode += "\tvar " + field;
    variablesCode += " = $(\"#" + field + "\")";
    variablesCode += ".val();\n"; 

    return variablesCode;
}

function loadFields() { 
    inputText = $("#inputFields").val();
    fields = inputText.split(",");
}

/**
 * Convert fields saved on array to
 * code.
 */
function convertToAjaxJquery() {
    var inputText = "";
    var convertedText = "";
    var ajaxJquery = "";
    var variablesCode = "";
    var jqueryButtonEventCode = "";

    for(var i = 0; i < fields.length; i++) {
        var booLast = i != fields.length-1
        var field = fields[i].replace(" ", "");

        convertedText += "\t\t\t\"" + field;
        convertedText += "\": " + field;

        if(booLast){
            convertedText += ",";
            convertedText += "\n";
        }

        variablesCode += assigmentCodeJquery(field);
        if(!booLast){
            variablesCode += "\n";
        }
    }
    
    ajaxJquery += variablesCode;
    ajaxJquery += "\t$.ajax({";
    ajaxJquery += "\n\t\ttype: \"POST\",";
    ajaxJquery += "\n\t\turl: \"/save_" + object.toLowerCase() + "/\",";
    ajaxJquery += "\n\t\tdatatype: \"json\",";
    ajaxJquery += "\n\t\tdata: {\n";
    ajaxJquery += convertedText;
    ajaxJquery += "\n\t\t},";    
    ajaxJquery += "\n\t\tsuccess: function(data) {}";
    ajaxJquery += "\n\t});";
    
    jqueryButtonEventCode += "$(\"#" + formId + "\").submit(function() {\n";
    jqueryButtonEventCode += ajaxJquery;
    jqueryButtonEventCode += "\n});";

    $("#javascript").text(jqueryButtonEventCode);
}

function convertToHtmlFields() {
    var fieldHtmlCode = "";
    fieldHtmlCode += "<form id=\"" + formId + "\">\n";
    fieldHtmlCode += "\t<table>\n";

    for(var i = 0; i < fields.length; i++){
        var booLast = i == fields.length-1
        var field = fields[i].replace(" ", "");
        var labelField = field[0].toUpperCase();
        labelField += field.substr(1, field.length).toLowerCase();

        fieldHtmlCode += "\t\t<tr>\n";        
        fieldHtmlCode += "\t\t\t<td><b>" + labelField + ":</b></td>\n";
        fieldHtmlCode += "\t\t\t<td><input type=\"text\" id=\"";
        fieldHtmlCode += field + "\"></td>\n";
        fieldHtmlCode += "\t\t</tr>\n";
    }
    
    fieldHtmlCode += "\t\t<tr>\n\t\t\t<td><input type=\"submit\" ";
    fieldHtmlCode += "value=\"Submit\"></td>\n\t\t</tr>\n";
    fieldHtmlCode += "\t</table>\n";
    fieldHtmlCode += "</form>";
    $("#html").text(fieldHtmlCode);
}

function convertToDjangoFunction() {
  var djangoCode = "";
  var djangoObjectCode = "";

  djangoCode += "from django.utils import simplejson\n";
  djangoCode += "from django.http import HttpResponse\n\n";
  djangoCode += "def save_" + object.toLowerCase() + "(request):\n";
  djangoCode += "\tsave = \"ok\"\n\n";

  djangoObjectCode += "\t" + object.toLowerCase() + " = " + object + "()\n";

  for(var i = 0; i < fields.length; i++){
     var booLast = i == fields.length-1
     var field = fields[i].replace(" ", "");
        
     djangoCode += "\t" + field + " = request.POST.get(\"" + field;
     djangoCode += "\", None)\n";
       
     djangoObjectCode += "\t" + object.toLowerCase() + "." + field; 
     djangoObjectCode += " = " + field + "\n";
  }

  djangoObjectCode += "\n\ttry: " + object.toLowerCase() + ".save()\n"     
  djangoObjectCode += "\texcept: save = \"fail\"\n"

  djangoCode += "\n" + djangoObjectCode; 
  djangoCode += "\n\tdict_return = {\n";
  djangoCode += "\t\t\"saved\": save\n";
  djangoCode += "\t}\n";
  djangoCode += "\tjson = simplejson.dumps(dict_return)\n";
  djangoCode += "\treturn HttpResponse(json, mimetype=\"application/json\")";
  $("#django").text(djangoCode);      
}

function convertToDjangoUrls() {
   var djangoUrlCode = "";

   djangoUrlCode += "from django.conf.urls.defaults import *\n"
   djangoUrlCode += "from django.views.generic.simple import direct_to_template\n\n"
   djangoUrlCode += "urlpatterns = patterns('',\n";
   djangoUrlCode += "\turl(\"^save_" + object.toLowerCase() + "/$\", \"application.views.save_" + object.toLowerCase() + "\")\n"
   djangoUrlCode += ")";

   $("#urls").text(djangoUrlCode);
}

$(document).ready(function() {
    $("#generatedResult").hide();
    $("#formGenerateJqueryAjax").submit(function() {
        loadFields();
        convertToAjaxJquery();
        convertToHtmlFields();
        convertToDjangoFunction();
        convertToDjangoUrls();
        $("#generatedResult").show("slow");
        return false;
    });

   /*
   $("#serviceName").keyup(function() {
      serviceName = $("#serviceName").val();
      $("#formGenerateJqueryAjax").submit();
   });
   */

   $("#formId").keyup(function() {
      formId = $("#formId").val();
      $("#formGenerateJqueryAjax").submit();
   });

   $("#objectName").keyup(function() {
      object = $("#objectName").val();
      $("#formGenerateJqueryAjax").submit();
   });

   $("#inputFields").keyup(function() {
      $("#formGenerateJqueryAjax").submit();
   });
});

