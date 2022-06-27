import { Injectable } from '@angular/core';

enum StorageScope {
	Local,
	Session
}

abstract class StorageApi {

	private getStorage(scope: StorageScope): Storage {
		if (scope == StorageScope.Local) {
			return localStorage;
		} else {
			return sessionStorage;
		}
	}

	protected getItem<T>(scope: StorageScope, key: string): null | T {
		let value = this.getStorage(scope).getItem(key);
		if (value != null) {
			return JSON.parse(value) as T;
		}

		return value;
	}

	protected setItem(scope: StorageScope, key: string, value: unknown): void {
		this.getStorage(scope).setItem(key, JSON.stringify(value));
	}

	public abstract read<T>(key: string): null | T;

	public abstract write(key: string, value: unknown): void
}

type LocalStorageKey = "jwt";

@Injectable({
	providedIn: 'root'
})
export class LocalStorageService extends StorageApi {
	public read<T>(key: LocalStorageKey): null | T {
		return super.getItem<T>(StorageScope.Local, key);
	}

	public write(key: LocalStorageKey, value: unknown): void {
		return super.setItem(StorageScope.Local, key, value);
	}
}

type SessionStorageKey = "isLoggedIn";

@Injectable({
	providedIn: 'root'
})
export class SessionStorageService extends StorageApi {
	public read<T>(key: SessionStorageKey): null | T {
		return super.getItem<T>(StorageScope.Session, key);
	}

	public write(key: SessionStorageKey, value: unknown): void {
		return super.setItem(StorageScope.Session, key, value);
	}
}
