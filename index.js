$(() => {
var pageNow = null;

const notFound = "404";
const home = "home";

function failedPage(jqXhr, textStatus, errorThrown, pageToLoad) {
  if (jqXhr.status == 404 && pageToLoad != notFound) {
    location.replace("#" + notFound);
  } else {
    loadPage(null, {title: "error during page loading", lang: "en-US", content: "Error during page loading. textStatus: " + textStatus + ", errorThrown: " + errorThrown}, "content");
  }
}
function updatePage() {
  const pageRegex = new RegExp("^[a-z0-9\-]+$");
  var hash = decodeURIComponent(location.hash.substring(1));
  var pageToLoad = hash.split("#", 1)[0];
  var anchor = hash.substring(pageToLoad.length + 1);
  if (!anchor) anchor = null;
  if (!pageToLoad) pageToLoad = home;
  if (!pageRegex.test(pageToLoad)) pageToLoad = notFound;
  if (pageToLoad != pageNow) {
    try {
      history.replaceState(null, null, "#" + pageToLoad + (anchor ? "#" + anchor : ""));
    } catch (e) {
      location.hash = "#" + pageToLoad + (anchor ? "#" + anchor : ""); // may be an iframe
    }
    loadPage(null, {title: "...", lang: "en-US", content: "Loading page..."}, "content");
    $.ajax({url: "pages/" + pageToLoad + ".json", dataType: "json", cache: true}).done(data => {
      if (data.content) {
        loadPage(pageToLoad, data, anchor);
      } else {
        $.ajax({url: data.contentUrl, dataType: "text", cache: true}).done(contentData => {
          data.content = contentData;
          loadPage(pageToLoad, data, anchor);
        }).fail((a, b, c) => failedPage(a, b, c, pageToLoad));
      }
    }).fail((a, b, c) => failedPage(a, b, c, pageToLoad));
  } else {
    goToAnchor(anchor);
  }
}
function popState(e) {
  if (e.state != null) {
    loadPage(e.state.id, e.state.data, e.state.anchor);
  }
}
function loadPage(pageId, pageData, anchor) {
  if (pageId != null) {
    try {
      history.replaceState({id: pageId, data: pageData, anchor: anchor}, null, "#" + pageId + (anchor ? "#" + anchor : ""));
    } catch (e) {
      location.hash = "#" + pageId + (anchor ? "#" + anchor : ""); // may be an iframe
    }
  }
  pageNow = pageId;
  document.title = "creeper123123321 - " + pageData.title;
  $("html title, #content").attr("lang", pageData.lang);
  $("#content").html(marked(pageData.content));
  goToAnchor(anchor);
}
function goToAnchor(anchor) {
  var anchorElement = document.getElementById(anchor);
  if (anchorElement) anchorElement.scrollIntoView();
}
$(window).on("popstate", popState);
$(window).on("hashchange", updatePage);
updatePage();
});
