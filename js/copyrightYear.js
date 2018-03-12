(function() {
  'use strict';

  var copyrightYear = document.getElementById('copyrightYear');
  var d = new Date();
  const SiteCreatYear = 2018;
  const CurrentYear = d.getFullYear();

  if (SiteCreatYear === CurrentYear) {
    copyrightYear.textContent = SiteCreatYear;
  } else {
    copyrightYear.textContent = `${SiteCreatYear}-${CurrentYear}`
  }

})();
