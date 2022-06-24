import { ErrorDetails } from "../../types/error-details";

export class TypeAssertions {
	public static isErrorDetails(error: unknown): error is ErrorDetails {
		let assertedError = error as ErrorDetails;
		return assertedError?.title != undefined && assertedError?.description != undefined;
	}
}
