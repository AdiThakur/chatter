const JWT_DELIMITER = ".";
const JWT_PAYLOAD_INDEX = 1;

type ClaimType = "id" | "name" | "exp" | "iss" | "aud";

export class Jwt {

	private readonly claims: null | { [key: string]: string };
	private expiration: Date;

	constructor(encodedJwt: string) {
		let encodedPayload = encodedJwt.split(JWT_DELIMITER)[JWT_PAYLOAD_INDEX];
		this.claims = JSON.parse(atob(encodedPayload));
		this.setExpiration();
	}

	public getClaim(claim: ClaimType): null | string {
		let value = this.claims?.[claim];
		if (!value) {
			return null;
		}

		return value;
	}

	public isValid(): boolean {
		return this.expiration > new Date();
	}

	private setExpiration(): void {
		let expirationInEpochSeconds = this.getClaim("exp") as ( null | number);
		if (expirationInEpochSeconds == null) {
			this.expiration = new Date();
		} else {
			this.expiration = new Date(expirationInEpochSeconds * 1000);
		}
	}
}
