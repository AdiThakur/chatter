const JWT_DELIMITER = ".";
const JWT_PAYLOAD_INDEX = 1;

type ClaimType = "id" | "name" | "exp" | "iss" | "aud";

export class Jwt {

	private readonly claims: null | { [key: string]: string };
	private expiration: Date;

	constructor(
		public readonly raw: string
	) {
		this.claims = this.parseClaims();
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

	private parseClaims(): null | { [key: string]: string } {
		let encodedPayload = this.raw.split(JWT_DELIMITER)[JWT_PAYLOAD_INDEX];
		return JSON.parse(atob(encodedPayload));
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
