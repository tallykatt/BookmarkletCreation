var $$;

function init() {
    $$ = jQuery;
    $$('table').mouseover( function() {

       var pos = $$(this).offset();
       var width = $$(this).width();
       var height= $$(this).height();
       $$(this).css("cursor","pointer");
       //if table-overlay already exists show it
       if ($$( "div.table-overlay" ).length ) {
        $$( "div.table-overlay" ).remove();
       } else {
        // otherwise add a div element with class "table-overlay" to the body element
           
        }

       //set position, height, width, color of table-overlay to match the table that is hovered over.
       var tableOverlay = $$("<div></div>");  
       tableOverlay = tableOverlay.addClass('table-overlay');

       tableOverlay.offset(pos);
       tableOverlay.width(width);
       tableOverlay.height(height);
       tableOverlay.css({"position": "absolute", "background-color": "rgba(0,0,0,0.4)", "z-index":100000, "pointer-events": "none", "cursor": "pointer","display": "table"});
       tableOverlay =  tableOverlay.append("<div></div>");

       tableOverlay.children('div').text('Click to download table as CSV file').css({"color": "white", "pointer-events": "none","display": "table-cell", "text-align": "center", "vertical-align": "middle", "font-size": "26px", "font-family": "Arial", "font-weight": "800"});

       $$('body').append(tableOverlay); 
        

    });
    $$('table').mouseleave( function() {
      //when mouse leaves the table, hide the div.table-overlay element.
        $$('div.table-overlay').hide();
    });
    $$('table').click( function() {
      // when table is clicked, start processing the data in table to be downloaded
        var table = $$(this);
        tableData(table);
  })
}

function csvDownload(str, utf) {
    // download table as CSV file  //
    var a = document.createElement('a');
    if (utf !== false) {
      a.href        = 'data:text/csv,' + str;
    } else {
      // if UTF == true download table as UTF-16 charset CSV file, for Excel //
      a.href        = 'data:text/csv;charset=utf-16,' + str;
    }
    a.target      = '_blank';
    a.download    = "tabledownload.csv";
    document.body.appendChild(a);
    a.click();
}

// check whether the table contains UTF-16 characters and determine what type of file should be downloaded
function utf16Checker(str) {
  var re = /%u\d/;
  var string = escape(str);
  var res = string.search(re);
  return (res !== -1);  
}


function tableData(table) {
  var tr = table.find('> tr, > tbody > tr');  
  var tableString = "";

  var tableData = $$.map(tr, function(tr) {
   var row = [$$.map($$(tr).children(), function(td) {
    return $$(td).text();
  })];
   return row;
 });
  
  
  tableData.forEach(function(entry) {
 
    entry.forEach(function(i) {
      //for each cell's content escape spaces, double quotes and breaks
      var re = new RegExp(" ", "g"),
          rdq = new RegExp('"', "g"),
          rlb = new RegExp("\n","g");
      i = i.trim();
      i = i.replace(re, "%20");
      i = i.replace(rdq, '\"');
      i = i.replace(rlb,'%0D');

      //add quotes around entire cell so that commas won't split the cell
      tableString += '"';
      tableString += i;
      tableString += '",';
      
    })

    //remove the last comma in a row so that there isn't an extra column and add a line break 
    tableString = tableString.substring(0, tableString.length - 1);
    tableString += "%0A";
     
  }); 

  if (utf16Checker(tableString)) {
    csvDownload(tableString, true);
    alert("NOTE: Because this table contains special characters, the data has been downloaded in UTF-16 format. This may cause compatibility issues with some spreadsheet programs.");
  } else {
    csvDownload(tableString, false);
  }   
}
init();


    

