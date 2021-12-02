import { DivisionType } from "./common/enums";

export type DivisionEntity = {
    identifier: number,
    divisionType: DivisionType,
    location: string,
    divisionName: string,
    description: string;
};

export type DivisionParams = {
    divisionType: DivisionType
};
