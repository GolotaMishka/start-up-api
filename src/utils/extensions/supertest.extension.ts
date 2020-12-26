import * as http from 'http';
import * as Test from 'supertest/lib/test';

Test.prototype._assertStatus = (status, res) => {
  if (res.status !== status) {
    return new Error(
      `expected ${status} "${http.STATUS_CODES[status]}" got ${res.status} "${http.STATUS_CODES[res.status]}" ${res.text && `with body ${JSON.stringify(JSON.parse(res.text), null, 2)}`}`
    );
  }
};
