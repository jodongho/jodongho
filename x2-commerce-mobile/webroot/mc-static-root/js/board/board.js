$.namespace("mboard.boardList"); // package
mboard.boardList = { // javascript object literal
	currentPage : 1,
	
	_ajax : common.Ajax,

	goInfo : function(seq) {
		document.location.href = _baseUrl + "board/info.do?seq=" + seq;
	},

	goInsertPage : function(parentSeq) {
		if (parentSeq == undefined) {
			parentSeq = '0';
		}

		document.location.href = _baseUrl + "board/insertPage.do?parentSeq="
				+ parentSeq;
	},

	goSearch : function() {
		var sform = $("#sform");

		if ($("#search") === '') {
			alert("검색어를 입력해주세요.");
			return true;
		}

		sform.attr('action', _baseUrl + "board/list.do");
		sform.attr('method', "GET");
		sform.submit();
	},

	searchKeyDown : function(e) {
		if (e.keyCode != 13) {
			return;
		}
		goSearch();
	},
	
	_appendBoardRow : function(index, boardObj) {
		var newRow = $("#removable-row-stub").clone(true);
		newRow.attr("id", "row" + index);
		newRow.addClass("row-for-single-board");
		newRow.css("visibility", "visible");
		
		boardObj.title = String(boardObj.title).split('<').join('&lt;');
		
		var title = boardObj.title + "[" + boardObj.c_count + "]";

		if (boardObj.fileName != null && boardObj.fileName != "") {
			title += "@";
		}

		var depth = boardObj.depth;
		var prefix = "";
		for (var i = 1; i < depth; i++) {
			prefix = "[ 답글 ] " + prefix;
		}

		newRow.find("#board-seq").text(boardObj.seq);
		newRow.find("#board-title").html(prefix + title);
		newRow.find("#board-title").attr("href",
				"javascript:mboard.boardList.goInfo('" + boardObj.seq + "')");
		newRow.find("#board-name").text(boardObj.name);
		newRow.find("#board-hit").text(boardObj.hit);

		var insertedDate = new Date(boardObj.insertedDate);
		newRow.find("#board-inserted-date").text(insertedDate.toISOString().slice(0,10).replace(/-/g,"/"));
		newRow.insertBefore("#removable-row-stub");
	},

	getBoardList : function(pageIdx) {
		if (pageIdx == null || pageIdx == undefined) {
		    pageIdx = 1;
		}

		var titleOrName = $("#titleOrName option:selected").val();
		var search = $("#search").val();

		this._ajax.sendJSONRequest(
		        "GET"
				, _baseUrl + "/board/listJSON.do"
				, "page="+ pageIdx + "&titleOrName=" + titleOrName + "&search=" + search
				, mboard.boardList._callback_getBoardList);
	},

	_callback_getBoardList : function(strData) {
//	    var arrBoard = $.parseJSON(strData);
		var arrBoard = strData;
		
		// message 에 JSONArray 형식의 데이터가 전송된다.
		var count = arrBoard.length;
		if (count === 0) {
			$("#td-for-no-contents").text("조회된 데이터가 없습니다.");
			return;
		}

		$("#row-for-no-contents").remove();
		

		for (var index in arrBoard) {
			var boardObj = arrBoard[index];
			// console.log(index + " = " + boardObj);
			mboard.boardList._appendBoardRow(index, boardObj);
		}

		// $("#removable-row-stub").remove();
		checkBoardInfoAuthority();
	},

	getJSONPBoard : function(pageIdx) {
		if (pageIdx == null || pageIdx == undefined) {
		    pageIdx = 1;
		}

		var titleOrName = $("#titleOrName option:selected").val();
		var search = $("#search").val();
		
		this._ajax.sendJsonpRequest("GET", _baseUrl + "board/listJSONP.do", "page="
				+ pageIdx + "&titleOrName=" + titleOrName + "&search=" + search,
				mboard.boardList._callback_JSONPBoardList);
	},

	_callback_JSONPBoardList : function(data) {
		mboard.boardList._callback_getBoardList(data);
	},

	_getMore : function() {
		var page = mboard.boardList.currentPage++;

		var titleOrName = $("#titleOrName option:selected").val();
		var search = $("#search").val();
		
		this._ajax.sendJSONRequest("GET", _baseUrl + "/board/listJSON.do", "page="
				+ page + "&titleOrName=" + titleOrName + "&search=" + search,
				mboard.boardList._callback_getBoardList);
	},

	_reload : function() {
		mboard.boardList.currentPage = 1;
		$(".row-for-single-board").remove();
		mboard.boardList._getMore();
	}
};

$.namespace("mboard.boardInsert");
mboard.boardInsert = {

    elRTE_opts : {
    	lang : 'ko',
    	toolbar  : 'simpleToolbar',
    	styleWithCSS : true,
    	allowSource : true,
    	height : 300
	},
		
	doInsert : function() {
		var iform = $("#iform");

		if ($("#title").val() === "") {
			alert("제목");
			return false;
		}
		if ($("#wId") === "") {
			alert("ID");
			return false;
		}
		var contents = $('#elrte_contents').elrte('val');
		if (contents === "") {
			alert("내용");
			return false;
		}
		$("#contents").val(contents);

		iform.attr('action', _baseUrl + "board/insert.do");
		iform.attr('method', "POST");

		return true;
	},
	
	init : function() {
		  elRTE.prototype.options.panels.simplePanel = [
	            'save','undo', 'redo', 'copy','cut','paste',
	            'fontname','fontsize',  'bold', 'italic', 'underline', 
	            'forecolor','hilitecolor', 
	            'justifyleft', 'justifyright','justifycenter', 'justifyfull', 
	            'formatblock', 'insertorderedlist', 'insertunorderedlist',
	            'link', 'image', 'flash', 
	            'fullscreen','nbsp'
	        ];
	        elRTE.prototype.options.toolbars.simpleToolbar = ['simplePanel'];

	      	$('#buttonUpload').bind('onUploadFinished', mboard.boardInsert._callback_Upload);
		},
		
		
		_callback_Upload : function(event, params){
			
			var savedFileName = params.savedFileName;
			var originalFileName = params.originalFileName;
			
			var fid = savedFileName.substring(0, savedFileName.indexOf("."));
			
			$("#form_table").append($('<tr id="'+fid+'"><td>업로드된 파일 : '+originalFileName
									 +'<a href="javascript:customFileUpload.removeTempFile(\''+savedFileName+'\', mboard.boardInsert._callback_removeTempFile);">[x]</a>'
									 +'</td></tr>'));
			$("#iform").append($('<input type="hidden" id="'+fid+'" name="savedFileName" value="'+savedFileName+'">'));
			$("#iform").append($('<input type="hidden" id="'+fid+'" name="originalFileName" value="'+originalFileName+'">'));
		},
		
		_callback_removeTempFile : function(data){
	    	var savedFileName = data;
	    	
	    	$('#'+savedFileName).remove();
	    	$('#'+savedFileName).remove();
	    	
		}
};

$.namespace("mboard.boardInfo");
mboard.boardInfo = {
	_ajax : common.Ajax,
	
	goList : function() {
		document.location.href = _baseUrl + "board/list.do";
	},

	deleteboard : function() {
		var iform = $("#iform");

		iform.attr('action', _baseUrl + "board/delete.do");
		iform.attr('method', "POST");

		iform.submit();
	},

	insertComment : function(seq) {
		var boardComment = $("#boardComment").val();

		if (seq == undefined || boardComment === "") {
			alert("내용이 없습니다.");
			return;
		}

		if (_utf8ByteCount(boardComment) > 2000) {
			alert("입력된 내용이 너무 깁니다. 최대 2000 Byte까지 입력할 수 있습니다.");
			return;
		}

		this._ajax.sendRequest("POST", _baseUrl + "board/insertComment.do", "seq="
				+ seq + "&boardComment=" + boardComment,
				mboard.boardInfo._callback_insertComment);
	},

	_callback_insertComment : function(message) {
		// 원래는 AJAX 처리를 해야 하지만, 편의를 위해 화면 갱신으로 처리한다.
		document.location.reload(true);
	},

	goUpdatePage : function(seq) {
		document.location.href = _baseUrl + "board/updatePage.do?seq=" + seq;
	},

	goDownload : function(seq) {
		document.location.href = _baseUrl + "board/download.do?seq=" + seq;
	}
};

$.namespace("mboard.boardUpdate");
mboard.boardUpdate = {

	doUpdate : function(seq) {

		var iform = $("#iform");

		if ($("#title") == "") {
			alert("제목");
			return false;
		}
		var contents = $('#elrte_contents').elrte('val');
		if (contents === "") {
			alert("내용");
			return false;
		}
		$("#contents").val(contents);

		iform.attr('action', _baseUrl + "board/update.do?seq=" + seq);
		iform.attr('method', "POST");

		return true;
	}
};
