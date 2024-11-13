import { StatusService } from "../../model/service/StatusService";
import { StatusItemRequest, StatusItemResponse } from "tweeter-shared";

export const handler = async (request: StatusItemRequest): Promise<StatusItemResponse> => {
  const statusService = new StatusService();
  const [items, hasMore] = await statusService.loadMoreStoryItems(
    request.token,
    request.alias,
    request.pageSize,
    request.lastItem
  );

  return {
    success: true,
    message: null,
    items: items,
    hasMore: hasMore,
  };
};
