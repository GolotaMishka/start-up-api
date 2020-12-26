import StatusCode from './statusCode';
import SuccessResponse from './success.response';

class DataResponse extends SuccessResponse {
  public static ok(payload?: object): DataResponse {
    return DataResponse.create(StatusCode.ok, payload);
  }

  public static created(payload?: object): DataResponse {
    return DataResponse.create(StatusCode.created, payload);
  }

  private static create(status: StatusCode, payload?: object): DataResponse {
    return new DataResponse(status, payload);
  }
}

export default DataResponse;
