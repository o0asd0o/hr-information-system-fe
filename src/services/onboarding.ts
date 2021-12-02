import { GetDocumentByEmployeeIdParam } from "@/models/api/onboarding";
import { getRequestWithToken } from "@/utils/request";

export async function getAllEmployeeDocuments({ employeeId }: GetDocumentByEmployeeIdParam): Promise<any> {

    const request = getRequestWithToken();
    return request('documents', { params: { employeeId } })
        .then((response) => {
            return {
                documents: response.documents,
                status: response.documentsCount !== null ? "SUCCESS" : null
            }
        });
}
