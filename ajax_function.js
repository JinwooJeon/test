
var MAXINFOLIST=50; //승인 대기 list 최대 50개
var infoList = new Array(MAXINFOLIST);
for(var i=0; i<MAXINFOLIST; i++) infoList[i] = new Array(3); // [n][0]=shopname, [n][1]=shopphone, [n][2]=shopid, 

var oldList = new Array(MAXINFOLIST);
for(var i=0; i<MAXINFOLIST; i++) oldList[i] = new Array(3); // [n][0]=shopname, [n][1]=shopphone, [n][2]=shopid, 
var oldNum=0;


var MAXUSERLIST=100;
var companyInfo = new Array(MAXUSERLIST);
for(var i=0; i<MAXUSERLIST; i++) companyInfo[i] = new Array(10);
 
var MAXDRESSLIST=50;
var dressList = new Array(MAXDRESSLIST);
for(var i=0; i<MAXDRESSLIST; i++)dressList[i] = new Array(2);
	
	
function login(code) {
	var URL= "./login.php?code=" + code;
	myReq.open("GET", URL, true);
	myReq.onreadystatechange = getLoginResponse;
	myReq.send(null);
}

function getLoginResponse() {
	if (myReq.readyState ==4) {
		if(myReq.status ==	200) {
			var result = myReq.responseXML.getElementsByTagName("check")[0];
			var resultReturn= result.childNodes[0].nodeValue;		
			if(resultReturn == "ok") {
				var name = myReq.responseXML.getElementsByTagName("name")[0];
				var nameReturn= name.childNodes[0].nodeValue;		
				window.location="http://www.weddingmaru.com/admin/admin_main.html";	
			}
			else {  
				document.getElementById('codeCheck').innerHTML="로그인 실패: 존재하지 않는 고유코드";
			}
		}
		else {
			//	
		}
	}
}


function getRequest() {
   var req =  false;
   try {
      /* for Firefox */
      req = new XMLHttpRequest(); 
   } catch (err) {
      try {
         /* for some versions of IE */
         req = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (err) {
         try {
            /* for some other versions of IE */
            req = new ActiveXObject("Microsoft.XMLHTTP");
         } catch (err) {
            req = false;
         }
     }
   }
   return req;
}


function getwaitlist() {
	var URL= "./php/getwaitlist.php";
	myReq.open("GET", URL, true);
	myReq.onreadystatechange = getwaitResponse;
	myReq.send(null);
	//document.getElementById("wait").innerHTML= '<img src="ajax-loader2.gif"/>';

}


function getwaitResponse() {
	if (myReq.readyState ==4) {
		if(myReq.status ==	200) {
			//document.getElementById("wait").innerHTML= ' ';
			var waitCount = myReq.responseXML.getElementsByTagName("total")[0];
			var count=waitCount.childNodes[0].nodeValue;
			var addTable=""
			for( var i =0; i< count ; i++) {
				var shopname = myReq.responseXML.getElementsByTagName("shopname")[i];
				var nameNode= shopname.childNodes[0].nodeValue;
				
				var shopPhone = myReq.responseXML.getElementsByTagName("tel")[i];
				var telNode= shopPhone.childNodes[0].nodeValue;

				var shopId = myReq.responseXML.getElementsByTagName("id")[i];
				var idNode= shopId.childNodes[0].nodeValue;
				
				addTable +="<tr ><td style='background-color:#dddddd; width:100%; height:40px; border:1px solid black; font-size:8px; word-break:break-all;'><span id='name"+i+"' >" ;
				var id = idNode;
				addTable += nameNode + "</span><br/><span>";
				addTable += telNode + "</span><br/><span id= 'user"+i+"' >";
				addTable += idNode + "</span></td> <td style=' width:40px; height:40px; padding:0px;'><input id='"+i+"' type='button' value=' 승인 ' style='width:40px; height:42px; font-size:10px;  border:1px solid black;'" ;
				addTable += "onclick='resultPermit(id)'"
				addTable += "></td></tr>";
			
			}//end for
			document.getElementById("infoListTable").innerHTML += addTable;
			
			var oldCount = myReq.responseXML.getElementsByTagName("oldtotal")[0];
			var oldCount=oldCount.childNodes[0].nodeValue;
			
			oldNum=oldCount; //oldNum, oldList is global var.(for search)
			var addOldTable = ""
			
			for(var i=0; i<oldNum; i++){
				var shopname = myReq.responseXML.getElementsByTagName("oldname")[i];
				var nameNode= shopname.childNodes[0].nodeValue;
				oldList[i][0]=nameNode;
				
				var shopPhone = myReq.responseXML.getElementsByTagName("oldtel")[i];
				var telNode= shopPhone.childNodes[0].nodeValue;
				oldList[i][1]=telNode;
				
				var shopId = myReq.responseXML.getElementsByTagName("oldid")[i];
				var idNode= shopId.childNodes[0].nodeValue;
				oldList[i][2]=idNode;
				
				addOldTable +="<tr><td style='background-color:#dddddd; width:100%; height:40px; border:1px solid black; font-size:8px;word-break:break-all;'><span id='oldname"+i+"' >" ;
				addOldTable += oldList[i][0] + "</span><br/><span>";
				addOldTable += oldList[i][1] + "</span><br/><span id= 'old"+i+"'>";
				addOldTable += oldList[i][2] + "</span></td> <td style=' width:40px; height:40px; padding:0px;'><input id='del"+i+"' type='button' value='  승인  \n  취소  ' style='width:40px; height: 42px; font-size:10px; border:1px solid black;' onclick='deletePermit(id)'></td></tr>";
				
			}
			document.getElementById("oldListTable").innerHTML = addOldTable;
		
		}
		else {
		//	document.getElementById("wait").innerHTML= '<img src="ajax-loader.gif"/>';
			
		}
	}

}

function resultPermit(id) {
	var userId=document.getElementById("user"+id).innerText;
	var name= document.getElementById("name"+id).innerText;
	var answer=confirm(name+ " 을 승인합니다. 확실합니까?");
	if( answer == true ) {
		var URL= "./php/setpermit.php?id="+ userId;
		myReq.open("GET", URL, true);
		myReq.onreadystatechange = function() { setpermitResponse(id);};
		myReq.send(null);	
	}
	else {
			//
	}
		
}

function setpermitResponse(id) {
	if (myReq.readyState ==4) {
		if(myReq.status ==	200) {	
			try{
				document.getElementById("user"+id).innerText=""
				document.getElementById(id).disabled="true";
				location.reload();
	
			}
			catch (err) {
				alert("승인실패");	
				location.reload();
			}
		}
	}//end if
}

function deletePermit(id) {
	id=id.replace("del" , ""); //prefix 'del' delete.
	var userId=document.getElementById("old"+id).innerText;
	var name=document.getElementById("oldname"+id).innerText;
	
	var answer=confirm(name+ " 의 승인을 취소합니다. 확실합니까?");
	if( answer == true ) {
		var URL= "./php/delpermit.php?id="+ userId;
		myReq.open("GET", URL, true);
		myReq.onreadystatechange = function() { delpermitResponse(id);};
		myReq.send(null);
	}
	else {
		//
	}
}

function delpermitResponse(id) {
	if (myReq.readyState ==4) {
		if(myReq.status ==	200) {	
			try{
				document.getElementById("old"+id).innerText=""
				document.getElementById("del"+id).disabled="true";
				location.reload();
	
			}
			catch (err) {
				alert("승인실패");	
				location.reload();
			}
		}
	}//end if
}

function getNotice() {
	var URL= "./php/getNotice.php";
	mySendReq.open("GET", URL, true);
	mySendReq.onreadystatechange = getNoticeResponse;
	mySendReq.send(null);	
}


function getNoticeResponse() {
	if (mySendReq.readyState ==4) {
		if(mySendReq.status ==	200) {	
			try{
				var totalcount = mySendReq.responseXML.getElementsByTagName("totalcount")[0];
				var totalMax= totalcount.childNodes[0].nodeValue;
				
				for(var j=0 ; j< totalMax ; j++) {
					var noticeNum = mySendReq.responseXML.getElementsByTagName("num")[j];
					var numNode= noticeNum.childNodes[0].nodeValue;
					
					noticeArray[j][0]=numNode;
				
					var title = mySendReq.responseXML.getElementsByTagName("title")[j];
					var titleNode= title.childNodes[0].nodeValue;	
					noticeArray[j][1]=titleNode;
				
					var noticeData = mySendReq.responseXML.getElementsByTagName("date")[j];
					var dataNode = noticeData.childNodes[0].nodeValue;	
					noticeArray[j][2]=dataNode;		
				}
				
				//call haesin's function(totalMax);
				announcement(totalMax);
			}
			catch(err)  {
					alert("Sysyem error in getNoticeResponse");
			}
		}
		else {
			//
		}
	}
}

function getContent(num) { //공지사항
	var URL= "./php/getContent.php?&num=" + num;
	mySendReq.open("GET", URL, true);
	mySendReq.onreadystatechange = getContentResponse;
	mySendReq.send(null);	
}


function getContentResponse() {
	if (mySendReq.readyState ==4) {
		if(mySendReq.status ==	200) {	
			try{
				var content = mySendReq.responseXML.getElementsByTagName("content")[0];
				var contentNode= content.childNodes[0].nodeValue;
				document.getElementById("noticeBody").innerHTML = contentNode;
			}
			catch(err)  {
					alert("Sysyem error in getNoticeResponse");
			}
		}
		else {
			//
		}
	}
}


function getList() { //공지사항
	var URL= "./php/getList.php";
	myReq.open("GET", URL, true);
	myReq.onreadystatechange = getListResponse;
	myReq.send(null);	
}


function getListResponse() {
	if (myReq.readyState ==4) {
		if(myReq.status ==	200) {	
			try{
				var totalcount = myReq.responseXML.getElementsByTagName("totalcount")[0];
				var totalMax= totalcount.childNodes[0].nodeValue;
				
				
				var addUserList = "<table id=\"userListTable\" style=\"table-layout:fixed; margin:0px 0px 20px 10px;border:1px solid black; border-collapse:collapse; background-color:#ffffff\"> <tr>"+
				"<td style=\"border:1px solid black; width:80px;\">업체명</td>"+"<td style=\"border:1px solid black;width:90px;\">가입일</td>"+
				"<td style=\"border:1px solid black;width:130px;\">ID</td><td style=\"border:1px solid black;width:90px;\">전화번호</td>"+
				"<td style=\"border:1px solid black;width:70px; font-size:12px;\">테이블번호</td><td style=\"border:1px solid black;width:70px;font-size:12px;\">예약카드 수</td>"+
				"<td style=\"border:1px solid black;width:70px;font-size:12px;\">고객카드 수</td><td style=\"border:1px solid black;width:70px;font-size:12px;\">등록 드레스 수</td>"+
				"<td style=\"border:1px solid black;width:40px;font-size:12px;\">드레스 룸 수</td><td style=\"border:1px solid black;width:60px;\">휴무일</td></tr>";
				
				for(var j=0 ; j< totalMax ; j++) {
					var name = myReq.responseXML.getElementsByTagName("name")[j];
					var nameNode= name.childNodes[0].nodeValue;
					
					var joindate = myReq.responseXML.getElementsByTagName("joindate")[j];
					var joindateNode= joindate.childNodes[0].nodeValue;
					
					var id = myReq.responseXML.getElementsByTagName("id")[j];
					var idNode= id.childNodes[0].nodeValue;
					
					var tel = myReq.responseXML.getElementsByTagName("tel")[j];
					var telNode= tel.childNodes[0].nodeValue;
					
					var table = myReq.responseXML.getElementsByTagName("table")[j];
					var tableNode= table.childNodes[0].nodeValue;
					
					var cardnum = myReq.responseXML.getElementsByTagName("cardnum")[j];
					var cardnumNode= cardnum.childNodes[0].nodeValue;
					
					var cusnum = myReq.responseXML.getElementsByTagName("cusnum")[j];
					var cusnumNode= cusnum.childNodes[0].nodeValue;
					
					var dressCnt = myReq.responseXML.getElementsByTagName("dresscnt")[j];
					var dressCntNode= dressCnt.childNodes[0].nodeValue;
					
					var roomCnt = myReq.responseXML.getElementsByTagName("roomcnt")[j];
					var roomCntNode= roomCnt.childNodes[0].nodeValue;
					
					var holiday = myReq.responseXML.getElementsByTagName("holiday")[j];
					var holidayNode= holiday.childNodes[0].nodeValue;
					
					
					companyInfo[j][0]=nameNode;
					companyInfo[j][1]=joindateNode;
					companyInfo[j][2]=idNode;
					companyInfo[j][3]=telNode;
					companyInfo[j][4]=tableNode;
					companyInfo[j][5]=cardnumNode;
					companyInfo[j][6]=cusnumNode;
					companyInfo[j][7]=dressCntNode;
					companyInfo[j][8]=roomCntNode;
					companyInfo[j][9]=holidayNode;
					
					addUserList+="<tr id=\"row"+i+"\" style=\"border:1px solid black;\"><td style=\"width:80px;\">"+companyInfo[i][0]+"</td>";
					addUserList+="<td style=\"width:90px;\">"+companyInfo[i][1]+"</td>";
					addUserList+="<td style=\"width:130px; word-break:break-all;\">"+companyInfo[i][2]+"</td>";
					addUserList+="<td style=\"width:90px;\">"+companyInfo[i][3]+"</td>";
					addUserList+="<td style=\"width:70px;\">"+companyInfo[i][4]+"</td>";
					addUserList+="<td style=\"width:70px;\">"+companyInfo[i][5]+"</td>";
					addUserList+="<td style=\"width:70px;\">"+companyInfo[i][6]+"</td>";
					addUserList+="<td style=\"width:70px;\">"+companyInfo[i][7]+"<input id=\"dressButton"+i+"\" type=\"button\" style=\"width:60px; height:30px; margin:5px 0px 0px 0px; font-size:10px;\" value=\"드레스 list\" onclick=\"onDressListClick('"+i+"')\"></td>";
					addUserList+="<td style=\"width:40px;\">"+companyInfo[i][8]+"</td>";
					addUserList+="<td style=\"width:60px;\">"+companyInfo[i][9]+"</td>";
					addUserList+="</tr>";
				}
				addUserList += "</table>";
				document.getElementById("userListDiv").innerHTML = addUserList;
				
				
				
			}
			catch(err)  {
					alert("Sysyem error in getListResponse");
			}
		}
		else {
			//
		}
	}
}









/*****************************************   **********************************************/

function  timeZip(longDate) {  // longdate : ex) 2012년 5월 12일
	if( longDate.length > 0 ) {
		var dateArray=longDate.split(" "); //dateArray[0]= 2012 [1]= 5 [2]= 12
		dateArray[0]=dateArray[0].substr(2,2); //12
		dateArray[1]=parseInt(dateArray[1], 10);
		dateArray[2]=parseInt(dateArray[2], 10);
		
		if ( Number(dateArray[1]) < 10 ) {
			dateArray[1]= "0" + dateArray[1].toString(); //05
		}
		if ( Number(dateArray[2]) < 10 ) {
			dateArray[2]= "0" + dateArray[2].toString(); //12
		}
		
		//alert(longDate + "=>" + dateArray[0]+dateArray[1]+dateArray[2]);
		return dateArray[0]+dateArray[1]+dateArray[2]; //2012년 5월 12일 => 120512 
	}
}


function timeUnzip(shortDate) {
	if( shortDate.length > 0) {
		var year= shortDate.substr(0,2);
		var month= shortDate.substr(2,2);
		var day= shortDate.substr(4,2);
		
		year="20"+ year.toString()+ "년"; //12 => 2012년
		if ( Number(month) < 10 ) {
			month=month.substr(1,1)+"월"; //05 => 5월
		}
		else {
			month=month+"월";
		}
		
		if ( Number(day) < 10 ) {
			day=day.substr(1,1)+"일"; //05 => 5월
		}
		else {
			day=day+"일";
		}
		
		//alert(shortDate + "=>" + year+" " + month + " " + day);
		return year+" " + month + " " + day;
	}

}