chrome.devtools.panels.elements.createSidebarPane('Ids', function (pane) {
  pane.setPage('pane.html');
  pane.onShown.addListener(function () {
    pane.setExpression('(' + getEls.toString() + ')()');
  });

  chrome.devtools.panels.elements.onSelectionChanged.addListener(function () {
    pane.setExpression('(' + getEls.toString() + `)($0)`);
  });

});

function getEls(node = document) {
  const ids = [
    "data-testid", 
    "data-test", 
    "data-tut", 
    "id",
    "aria-label",
  ];
  const res = {};

  for (const id of ids) {
    res[id] = extractIds(id, node);
    res[id].__proto__ = null;
  }

  function extractIds(attr, node) {
    return Array.from(node.querySelectorAll(`[${attr}]`))
      .reduce((acc, el) => {
        const key = el.getAttribute(attr);
        if (!acc.hasOwnProperty(key)) {
          acc[key] = [];
        }
        acc[key].push(el);
        return acc;
      }, {});
  }

  for (const key in res) {
    if(Object.keys(res[key]).length === 0){
      delete res[key];
    }
  }
  
  Object.setPrototypeOf(res, null);
  return res;
}
