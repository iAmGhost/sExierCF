// ==UserScript==
// @name        sExierCF
// @namespace   http://iamghost.kr
// @version     2.0.1
// @description better ExCF!
// @include     http://s.excf.com/*
// @include     http://excf.com/*
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require     https://raw.githubusercontent.com/madapaja/jquery.selection/master/src/jquery.selection.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_log
// ==/UserScript==

var file_count = 0;
var boardMap = {
    "gene1": "cartoon",
    "free3": "free",
    "ev": "playground",
    "game": "game",
    "eatball": "eatball",
    "opin": "general",
    "cre1": "creation",
    "ddf": "that"
};

$(document).ready(function() {
    var uri = location.href;
    
    if (~uri.indexOf("zboard.php?id=index")) {
        var alt_index = getConfig("alt_index", null);
        
        if (alt_index && !~alt_index.indexOf("zboard.php?id=index"))  {
            location.href = alt_index;
        }
    }
    
    if (~uri.indexOf("http://s.excf.com"))
    {
        mobileRedirector(uri);
    }
    else if (~uri.indexOf("ExCF.htm"))
    {
        titleChanger();
    }
    else if(~uri.indexOf("menu.php"))
    {
        menuAdder();
        nicknameSaver();
    }
    else if (~uri.indexOf("showconfig=true"))
    {
        GM_config.open();
    }
    else if (~uri.indexOf("write.php"))
    {
        writeFormModder();
        editorAdder();
        gothicKaliburWarner();
    }
    else if (~uri.indexOf("id=freee"))
    {
        if (getConfig("wider_freee", true)) {
            $('table').attr('width', '100%');
        }
    }
    else if (~uri.indexOf("view.php"))
    {
        contextMenuFixer();
        viewPageModder();
        emailCollectorAdder();
    }
    else if (~uri.indexOf("agecheck.php"))
    {
        ageCheckModder();
    }
    else if (~uri.indexOf("id=ddf"))
    {
        ageCheckValid();
    }
        
    if (~uri.indexOf("zboard.php"))
    {
        var today = new Date();
        if (today.getMonth()+1 == 4 && today.getDate() == 1) {
            if (!GM_getValue("april_fools")) {
                alert("회원 탈퇴가 완료되었습니다.");
                alert("뻥입니다. - 나유령")
                GM_setValue("april_fools", true);
            }
        }
        contextMenuFixer();
        nicknameSearchAdder();
    }

});

function contextMenuFixer() {
    var regex = /ZB_layerAction\(event,.+?'(.+?)','(.+?)'\)/;


    $("span").filter(function() {
        return $(this).attr("onmousedown");
    }).each(function (index) {
        var element = $(this);

        var search = element.attr("onmousedown").match(regex);

        var layer = $("#" + search[1]);
        var state = search[2];

        element.attr("onmousedown", "");

        element.click(function(event) {
            var offset = $(this).offset();

            layer.css("left", event.pageX - 13);
            layer.css("top", event.pageY - 12);
            layer.css("visibility", state);

            return false;
        });
    });
}

function ageCheckValid(valid)
{
    if (GM_getValue("jumin_auto_valid", false) == false && $("#body"))
    {
        alert("그게시판 인증 정보가 저장되었습니다.");
        GM_setValue("jumin_auto_valid", true);
    }
}

function gothicKaliburWarner() {
    $.get( "member_modify.php", function( data ) {
      $(".result").html( data );
        var count = data.match(/<strong>(\d+)\<\/strong> \(오늘 올린 글\)/)[1];
        $("div[class=contents]").after($.parseHTML('<p align="center">오늘 올린 글:' + count + '</p>'));
        
    });
}

function nicknameSearchAdder()
{
    var vars = getUrlVars();
    
    var p = $(document.createElement("p"));
                
    var button = $(document.createElement("a"))
                    .html("내가 쓴 글 보기")
                    .attr({href: "zboard.php?id=" + vars["id"] + "&sn1=on&sn=on&ss=off&sc=off&keyword=" + GM_getValue("nickname")});
    
    button.appendTo(p);
    p.appendTo($("div[class=navbar_center]"));
}

function checkSelection(text)
{
    if (text.length == 0) {
        alert("먼저 적용할 텍스트를 선택해주세요.");
        return false;
    }
    
    return true;
}

function emailCollectorAdder()
{
    if ($('td[class=middle] a[href^="mailto:"]').length)
    {
        var table = $("table[class=comments]");
        
        var tr = $(document.createElement("tr"));
        
        var td = $(document.createElement("td"));
       
        td.addClass("left");
        tr.append(td);
        
        td = $(document.createElement("td"));
        
        var input = $(document.createElement("input"));
        input.addClass("submit_text");
        input.attr("type", "button");
        input.val("이메일 수집기");
        input.click(function() {
            var links = [];
            var containsGovEmail = false;
            
            $("td[class=middle]").each(function() {
                var a = $(this).find("a");
                
                if (a != null)
                {
                    var link = a.attr("href");
                    try {
                        if (link.search("mailto:") == 0)
                        {
                            if (getConfig("email_collector_no_gov", true) && link.substr(-5,5) == "go.kr")
                            {
                                containsGovMail = true;                            
                            }
                            else
                            {
                                links.push(link.replace("mailto:", ""));
                            }
                        }
                    }
                    catch (err)
                    {
                        
                    }

                }
            });

            if (links.length > 0)
            {
                var resultArea = $("#email_collector_result")
                resultArea.val(links.join(", "));
                resultArea.show("fast");
                
                if (containsGovMail)
                {
                    alert("메일주소중 정부기관(go.kr) 메일을 제외하였습니다.\n설정에서 이 기능을 끌 수 있습니다.");
                }
            }
            else
            {
                if (containsGovMail)
                {
                    alert("메일주소중 정부기관(go.kr) 메일을 제외하였습니다.\n설정에서 이 기능을 끌 수 있습니다.\n그 외엔 발견된 메일이 없습니다.");
                }
                else
                {
                    alert("발견된 이메일이 없습니다.");   
                }
            }
        });

        td.addClass("middle");
        td.append(input);
        
        td.append($(document.createElement("br")));
        
        var textarea = $(document.createElement("textarea"));
        textarea.attr("id", "email_collector_result");
        textarea.css({"width": "100%", "height": "100%"});
        textarea.hide();
        
        td.append(textarea);
        
        tr.append(td);
        
        table.append(tr);
    }
}


function editorAdder()
{
    var vars = getUrlVars();
    
    var textarea = $("textarea[name=memo]");
    
    var div = $(document.createElement("div"))
                .attr({"class": "navbar",
                        "align": "left",
                        "style": "padding-bottom: 0px; margin-bottom: 0px; padding-top: 10px;"});
                
    var button = $(document.createElement("input"))
                    .val("굵♂게")
                    .attr({"class": "submit_text",
                            "type": "button",
                            "style": "margin-right: 10px;"})
                    .click(function() {
                        if (checkSelection(textarea.selection())) {
                            textarea.selection("insert", {text: "<b>", mode: "before"});
                            textarea.selection("insert", {text: "</b>", mode: "after"});
                        }
                    });
                    
    button.appendTo(div);
    
    var button = $(document.createElement("input"))
                    .val("링크")
                    .attr({"class": "submit_text",
                            "type": "button",
                            "style": "margin-right: 10px;"})
                    .click(function() {
                        if (checkSelection(textarea.selection())) {
                            var link = prompt("링크 주소를 입력해주세요.", "");
                            
                            if (link.length > 0) {
                                textarea.selection("insert", {text: '<a href="' + link + '" target="_blank">', mode: "before"});
                                textarea.selection("insert", {text: "</a>", mode: "after"});
                            }
                        }
                    });
                    
    button.appendTo(div);
    
    var button = $(document.createElement("input"))
                    .val("이미지")
                    .attr({"class": "submit_text",
                            "type": "button",
                            "style": "margin-right: 10px;"})
                    .click(function() {
                        var link = prompt("이미지 파일 주소를 입력해주세요.", "");
                    
                        if (link.length > 0) {
                            textarea.selection("insert", {text: '<img src="' + link + '"/>', mode: "before"});
                        }
                    });
                    
    button.appendTo(div);
    
    var button = $(document.createElement("input"))
                    .val("embed")
                    .attr({"class": "submit_text",
                            "type": "button",
                            "style": "margin-right: 10px;"})
                    .click(function() {
                        var uri = prompt("파일 주소를 입력해주세요.");
                        
                        if (uri.length < 0) {
                            return ;
                        }
                        
                        var width = prompt("가로 크기를 입력해주세요.", 560);
                        var height = prompt("세로 크기를 입력해주세요.", 315);
                        
                        textarea.selection("insert", {text: '<embed src="' + uri + '" width="' + width + '" height="' + height + '"/>', mode: "before"});
                    });
                    
    button.appendTo(div);
    
    var button = $(document.createElement("input"))
                    .val("유튜브")
                    .attr({"class": "submit_text",
                            "type": "button",
                            "style": "margin-right: 10px;"})
                    .click(function() {
                        alert("유튜브 동영상은 유튜브 주소를 넣으면 글쓰기시 자동으로 변환됩니다.");
                    });
                    
    button.appendTo(div);
    
    var button = $(document.createElement("input"))
                    .val("iframe")
                    .attr({"class": "submit_text",
                            "type": "button",
                            "style": "margin-right: 10px;"})
                    .click(function() {
                        alert("iframe 코드를 넣으면 글쓰기시 자동으로 embed 코드로 변환됩니다.");
                    });
                    
    button.appendTo(div);
    

    
    textarea.before(div);
}

function ageCheckModder()
{
    var jumin_first = GM_getValue("jumin_first", false);
    var jumin_last = GM_getValue("jumin_last", false);
    var jumin_auto = GM_getValue("jumin_auto", true);
    var jumin_auto_valid = GM_getValue("jumin_auto_valid", false);
    
    if (jumin_auto && jumin_auto_valid && jumin_first && jumin_last)
    {
        $("input[name=resno1]").val(jumin_first);
        $("input[name=resno2]").val(jumin_last);
        $("form").submit();
    }
    
    $("form").submit(function() {
        GM_setValue("jumin_first", $("input[name=resno1]").val());
        GM_setValue("jumin_last", $("input[name=resno2]").val());
    });
}

function deleteLastData()
{
    GM_deleteValue("last_content");
    GM_deleteValue("last_subject");
    GM_deleteValue("last_category");
}

function nicknameSaver()
{
    var nickname = $('a[href*="member_memo.php"]').find("b").html();
    
    GM_setValue("nickname", nickname);
}

function mobileRedirector(uri)
{
    var splitted = uri.split("/");
    
    var boardName = "";
        
    for (var key in boardMap)
    {
        if (boardMap[key] == splitted[splitted.length-1]) break;
    }
    
    var mode = splitted[splitted.length-2];
    
    if (mode == "list")
    {
        location.replace("http://excf.com/bbs/zboard.php?id=" + key);
        deleteLastData();
    }
    else if (mode == "post") {
    	alert("모바일 페이지 로그인이 안 되어있어 글쓰기에 실패하였습니다.\n글쓰기 버튼을 누르면 내용은 복구됩니다만, 첨부파일은 다시 선택해주세요.");

        location.href = "http://excf.com/bbs/zboard.php?id=" + key;
    }
}

function viewPageModder()
{
    var comments = $("div[class=comments]");
    
    comments.find(".name span").each(function() {
        var name = $(this).html();
        
        var a = $(document.createElement("a"))
            .html("[+]")
            .attr({ href: "javascript:void();" })
            .click(function() {
                var input = $("input[name=memo]");
                input.val(name + "> ");
                
                input.focus();
                var tmpStr = input.val();
                input.val('');
                input.val(tmpStr);
            });
        
        $(this).after(a);
        
    });
    
    $("embed").each(function(index, element) {
        var element = $(element);
        var url = $(this).attr("src");
        
        if (url.indexOf("http://excf.com/bbs/skin/excf_new/memo_on.swf") != -1) {
            //do nothing
        } else if (url.indexOf("youtube.com/embed/") >= 0) {
            element.attr("src", url.replace("/embed/", "/v/"));
        } else if (url.indexOf("youtube.com/v/") >= 0) {
            //do nothing
        } else {

        }

        var link = $("<p><a href='#'>[동영상이 안 보이면 클릭]</a></p>");

        link.click(function() {
            var iframe = $("<iframe frameborder=0></iframe>");

            iframe.attr("src", element.attr("src"));
            iframe.attr("width", element.attr("width"));
            iframe.attr("height", element.attr("height"));
            iframe.attr("style", element.attr("style"));

            element.replaceWith(iframe);
            
            link.remove();

            return false;
        });
        
        element.after(link);
    });
    
    var uriVars = getUrlVars();
    var uri = "http://excf.com/bbs/view.php?id=" + uriVars["id"] + "&no=" + uriVars["no"];
    $("ul[class=header]").prepend($.parseHTML('<div style="float:right; font-size: 12px; padding-right: 30px; padding-top: 5px;"><a style="color: grey;" href="' + uri + '">' + uri + '</a></div>'));
}

function getConfig(name, defValue)
{
    var value = GM_config.get(name);
    
    if (typeof value == "undefined" || value == null)
    {
        return defValue;
    }
    
    return value;
}

function writeFormModder()
{
    var frm = $("form[name=write]");
    var memo = $("textarea[name=memo]");
    var subject = $("input[name=subject]");
    var category = $("select[name=category]");
    
    
    if (getConfig("signature_toggle", false) && !~memo.val().indexOf("-----------\n"))
    {
        memo.val(memo.val() + "\n\n\n-----------\n" + getConfig("signature_value", ""));
    }
    
    if (getConfig("auto_use_html", true))
    {
        $('input[name=use_html]')
            .prop('checked', true)
            .val(1);
    }
    
    var last_content = GM_getValue("last_content", false);
    
    if (last_content != false)
    {
        memo.val(last_content);
        subject.val(GM_getValue("last_subject"));
        category.val(GM_getValue("last_category"));
        document.check_attack.check.value = 0;
        
        deleteLastData();
    }
    
    frm.submit(function(evt) {
        filter = new Array();
        filterResult = new Array();
        
   		filter.push(/^http.+?(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/gm);
    	filterResult.push('<embed src="http://www.youtube.com/v/$1?version=3&amp;hl=ko_KR" type="application/x-shockwave-flash" width="560" height="315" allowscriptaccess="always" allowfullscreen="true"></embed>\n유튜브 영상: <a href="https://youtu.be/$1">https://youtu.be/$1</a>');
 
        filter.push(new RegExp('<iframe(.+?)</iframe>', "g"));
        filterResult.push('<embed$1</embed>');
        
        filter.push(new RegExp("<object.+?>(.+?)</object>", "g"));
        filterResult.push('$1');
        
        filter.push(new RegExp("<param.+?>(.+?)</param>", "g"));
        filterResult.push('');
        
        filter.push(new RegExp("<param.+?>", "g"));
        filterResult.push('');
        
        filter.push(new RegExp("^(http(|s)://.+?\.(png|gif|jpg|jpeg|bmp))$", "gm"));
        filterResult.push('<img src="$1"/>');
        
        filter.push(new RegExp("^#(http(|s)://.+?)$", "gm"));
        filterResult.push('<img src="$1"/>');
        
        for (var i = 0; i < filter.length; i++)
        {
            memo.val(memo.val().replace(filter[i], filterResult[i]));
        }
        
        if (file_count > 0) 
        {
            frm.attr({
                action: "http://s.excf.com/post/" + boardMap[getUrlVars()["id"]],
                enctype: "multipart/form-data"
            });
            memo.attr({ name: "contents" });
            GM_setValue("last_content", memo.val());
            GM_setValue("last_subject", subject.val());
            GM_setValue("last_category", category.val());
        }
        
        return true;
    });
    
    var fileform = $(document.createElement("div"))
        .attr({id: "fileuploads"});
    
    var input = $(document.createElement("input"))
        .attr(
            {
                type: "button",
                id: "post_add"
            })
        .val("첨부파일 추가")
        .click(function() {
            var div = $(document.createElement('div'))
                .attr({id: "post_file" + file_count});
            
            var input = $(document.createElement('input'))
                .attr(
                    {
                        type: "file",
                        name: "file" + file_count,
                        accept: "image/*"
                    });
            
            var del = $(document.createElement('input'))
                .attr(
                    {
                        type: "button",
                        accept: "image/*",
                    })
                .val("삭제")
                .click(function() {
                    div.remove();
                });
            
            div.append(input);
            div.append(del);
            
            div.appendTo("#fileuploads");
            
            file_count++;
        });
    
    input.appendTo(fileform);
    
    var vars = getUrlVars();
    
    if (getConfig("use_image_upload", false) && vars["mode"] != "modify" && boardMap[vars["id"]])
    {
        memo.after(fileform);
    }
}

function titleChanger()
{
    var title = getConfig("title", "대한예수교장로회 ExCF");
    
    if (title != "")
    {
        document.title = title;
    }
}

function menuAdder()
{
    var links = document.getElementsByTagName("a");
    
    for (i = 0; i < links.length; i++)
    {
        var link = links[i];
        var uri = new String(link.href);
        var div = link.parentNode.parentNode;
        var p = link.parentNode;
        
        if (~uri.indexOf("EX1"))
        {
            select = document.createElement("select");
            select.style.width = "120px";
            select.setAttribute("onChange", 'var value = this.options[this.selectedIndex].value; if (value != "#") top.excf_contents.location.href = value; this.selectedIndex = 0');
            
            option = new Option();
            option.text = "기타 게시판";
            option.value = "#";
            select.add(option);
            
            option = new Option();
            option.text = "------------";
            option.value = "#";
            select.add(option);
            
            option = new Option();
            option.text = "간석지";
            option.value = "bbs/zboard.php?id=freee";
            select.add(option);
            
            option = new Option();
            option.text = "그게시판";
            option.value = "bbs/zboard.php?id=ddf";
            select.add(option);
            
            option = new Option();
            option.text = "나만 아는 진실";
            option.value = "bbs/zboard.php?id=true";
            select.add(option);
            
            option = new Option();
            option.text = "먹";
            option.value = "bbs/zboard.php?id=eatball";
            select.add(option);
            
            option = new Option();
            option.text = "이퀘스트리아";
            option.value = "bbs/zboard.php?id=equestria";
            select.add(option);
            
            option = new Option();
            option.text = "작업";
            option.value = "bbs/zboard.php?id=work";
            select.add(option);
            
            option = new Option();
            option.text = "행정실";
            option.value = "bbs/zboard.php?id=secret";
            select.add(option);
            
            
            option = new Option();
            option.text = "GMC - 진료실";
            option.value = "bbs/zboard.php?id=gmc";
            select.add(option);
            
            option = new Option();
            option.text = "GMC - 약국";
            option.value = "bbs/zboard.php?id=phar";
            select.add(option);
            
            option = new Option();
            option.text = "GMC - 집단";
            option.value = "http://holocaust77.hosting.paran.com/xe/gmc";
            select.add(option);
            
            option = new Option();
            option.text = "GMC - 설문조사";
            option.value = "http://note.blueweb.co.kr/bluecgi/survey/survey.php?dataname=gothick0&uid=1";
            select.add(option);
            
            option = new Option();
            option.text = "합필 - 고두익";
            option.value = "http://qrobo.dcinside.com/inner/?mode=search3&g_name=composition_dc&g_s1=1&q=%EA%B3%A0%EB%91%90%EC%9D%B5";
            select.add(option);
            
            option = new Option();
            option.text = "------------";
            option.value = "#";
            select.add(option);
            
            option = new Option();
            option.text = "sExierCF 설정";
            option.value = "http://excf.com/?showconfig=true";
            select.add(option);
            
            option = new Option();
            option.text = "파일첨부 설정";
            option.value = "http://s.excf.com/config";
            select.add(option);
            
            div.insertBefore(select, p);
            
            continue;
        }
        else if (~uri.indexOf("freee"))
        {
            p.removeChild(link);
            continue;
        }
        else if (~uri.indexOf("ddf"))
        {
            p.removeChild(link);
            break;
        }
    }
}

GM_config.init("sExierCF 설정",
               {
                   title:
                   {
                       label: "홈페이지 타이틀",
                       type: "text",
                       cols: 50,
                       default: ""
                   },
                   alt_index:
                   {
                       label: "첫 페이지 바꾸기(about:blank를 입력하면 빈 페이지가 됩니다)",
                       type: "text",
                       cols: 50,
                       default: ""
                   },
                   use_image_upload:
                   {
                       label: "이미지 업로드 사용",
                       type: "checkbox",
                       default: true
                   },
                   email_collector_no_gov:
                   {
                       label: "이메일 수집기: 정부 관련 도메인 제외",
                       type: "checkbox",
                       default: true
                   },
                   jumin_auto:
                   {
                       label: "그게시판 주민번호 인증 자동으로 하기",
                       type: "checkbox",
                       default: true
                   },
                   auto_use_html:
                   {
                       label: "HTML 사용 자동으로 하기",
                       type: "checkbox",
                       default: true
                   },
                   wider_freee:
                   {
                       label: "간석지 보기 편하게 하기",
                       type: "checkbox",
                       default: true
                   },
                   signature_toggle:
                   {
                       label: "글 작성시 자동으로 서명 넣기",
                       type: "checkbox",
                       default: false
                   },
                   signature_value:
                   {
                       label: "서명 내용<br>",
                       cols: 100,
                       rows: 10,
                       type: "textarea",
                       default: ""
                   }
               },
               {
                   save: function() {
                       alert("저장되었습니다.");
                       top.location.href = "http://excf.com/ExCF.htm";
                   },
                   
                   close: function()
                   {
                       top.location.href = "http://excf.com/ExCF.htm";
                   }
                   
               });

//http://snipplr.com/view.php?codeview&id=799
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    
    return vars;
}