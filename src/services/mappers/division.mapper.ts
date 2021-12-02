import { DivisionEntity } from "@/models/api/division";

export const mapResponseToDivisions = (divisions: any): DivisionEntity[] => {
    if (divisions.length > 0) {
        return divisions.map((division: DivisionEntity) => ({
            identifier: division.identifier,
            divisionType: division.divisionType,
            location: division.location,
            divisionName: division.divisionName,
            description: division.description,
        }))
    }
    return [];
}