import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/v1/users`);
    }

    getById(id: number) {
        return this.http.get(`${environment.apiUrl}/v1/users/${id}`);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/v1/users`, user);
    }

    update(user: User) {
        return this.http.put(`${environment.apiUrl}/v1/users/${user.id}`, user);
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/v1/users/${id}`);
    }
}