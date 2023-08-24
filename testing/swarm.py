from locust import HttpUser, task

class LHRUser(HttpUser):
    @task
    def login(self):
        self.client.post('/token', data={'username': 'admin@admin.com', 'password': 'Password'})
