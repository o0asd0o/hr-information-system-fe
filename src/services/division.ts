import { DivisionEntity, DivisionParams } from '@/models/api/division';
import { getRequestWithToken } from '@/utils/request';
import { mapResponseToDivisions } from './mappers/division.mapper';

const request = getRequestWithToken();

export async function getAlDivisions(params?: DivisionParams): Promise<any> {
    return request('divisions', { params })
        .then((response) => {
            return {
                divisions: mapResponseToDivisions(response.divisions) as DivisionEntity[]
            }
        });
};
