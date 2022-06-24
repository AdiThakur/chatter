const JWT_KEY = "jwt";

export class JwtStorageHelper {

	public static writeEncodedJwt(encodedJwt: string): void {
		localStorage.setItem(JWT_KEY, encodedJwt);
	}

	public static readEncodedJwt(): null | string {
		return localStorage.getItem(JWT_KEY);
	}
}
