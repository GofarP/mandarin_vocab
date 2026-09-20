<?php

test('registration screen cannot be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(404);
});

test('users cannot register through post', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertStatus(404);
});
