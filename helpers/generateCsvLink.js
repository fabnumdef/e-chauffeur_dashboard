import { DateTime } from 'luxon';

export default (data, index) => {
  if (window && window.document && window.btoa) {
    const encodedUri = encodeURI(`data:text/csv;base64,${window.btoa(data)}`);
    const link = window.document
      .createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `export_${DateTime.fromISO(DateTime.local()).toFormat('dd_MM_yyyy')}_part${index}.csv`,
    );
    window.document.body.appendChild(link);
    link.click();
    link.remove();
  }
};
