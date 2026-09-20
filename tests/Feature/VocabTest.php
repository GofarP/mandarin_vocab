<?php

use App\Models\User;
use App\Models\Vocab;

it('allows guests to view the vocabs list page', function () {
    $response = $this->get(route('vocabs.index'));

    $response->assertStatus(200);
});

it('prevents guests from storing a vocab and redirects to login', function () {
    $payload = [
        'hanzi' => '苹果',
        'pinyin' => 'píng guǒ',
        'meaning' => 'Apel',
    ];

    $response = $this->post(route('vocabs.store'), $payload);

    $response->assertRedirect(route('login'));
    $this->assertDatabaseMissing('vocabs', [
        'hanzi' => '苹果',
    ]);
});

it('prevents guests from updating a vocab and redirects to login', function () {
    $vocab = Vocab::create([
        'hanzi' => '火',
        'pinyin' => 'huǒ',
        'meaning' => 'Api',
    ]);

    $response = $this->put(route('vocabs.update', $vocab), [
        'hanzi' => '火',
        'pinyin' => 'huǒ',
        'meaning' => 'Api membara',
    ]);

    $response->assertRedirect(route('login'));
    $this->assertDatabaseMissing('vocabs', [
        'meaning' => 'Api membara',
    ]);
});

it('prevents guests from deleting a vocab and redirects to login', function () {
    $vocab = Vocab::create([
        'hanzi' => '山',
        'pinyin' => 'shān',
        'meaning' => 'Gunung',
    ]);

    $response = $this->delete(route('vocabs.destroy', $vocab));

    $response->assertRedirect(route('login'));
    $this->assertDatabaseHas('vocabs', [
        'id' => $vocab->id,
    ]);
});

it('allows authenticated users to store a new vocab', function () {
    $user = User::factory()->create();

    $payload = [
        'hanzi' => '苹果',
        'pinyin' => 'píng guǒ',
        'meaning' => 'Apel',
        'notes' => 'Buah apel yang manis.',
    ];

    $response = $this->actingAs($user)->post(route('vocabs.store'), $payload);

    $response->assertRedirect(route('vocabs.index'));
    $this->assertDatabaseHas('vocabs', [
        'hanzi' => '苹果',
        'pinyin' => 'píng guǒ',
        'meaning' => 'Apel',
    ]);
});

it('validates required fields when authenticated user stores a vocab', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('vocabs.store'), [
        'hanzi' => '',
        'pinyin' => '',
        'meaning' => '',
    ]);

    $response->assertSessionHasErrors(['hanzi', 'pinyin', 'meaning']);
});

it('allows authenticated users to update an existing vocab', function () {
    $user = User::factory()->create();

    $vocab = Vocab::create([
        'hanzi' => '水',
        'pinyin' => 'shuǐ',
        'meaning' => 'Air biasa',
    ]);

    $response = $this->actingAs($user)->put(route('vocabs.update', $vocab), [
        'hanzi' => '水',
        'pinyin' => 'shuǐ',
        'meaning' => 'Air minum segar',
        'notes' => 'Minum air putih setiap hari.',
    ]);

    $response->assertRedirect(route('vocabs.index'));
    $this->assertDatabaseHas('vocabs', [
        'id' => $vocab->id,
        'meaning' => 'Air minum segar',
        'notes' => 'Minum air putih setiap hari.',
    ]);
});

it('allows authenticated users to delete a vocab', function () {
    $user = User::factory()->create();

    $vocab = Vocab::create([
        'hanzi' => '茶',
        'pinyin' => 'chá',
        'meaning' => 'Teh',
    ]);

    $response = $this->actingAs($user)->delete(route('vocabs.destroy', $vocab));

    $response->assertRedirect(route('vocabs.index'));
    $this->assertDatabaseMissing('vocabs', [
        'id' => $vocab->id,
    ]);
});

it('can filter vocabs with search query', function () {
    Vocab::create([
        'hanzi' => '咖啡',
        'pinyin' => 'kā fēi',
        'meaning' => 'Kopi',
    ]);

    $response = $this->get(route('vocabs.index', ['search' => 'kā fēi']));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Vocabs/Index')
        ->has('vocabs', 1)
        ->where('vocabs.0.hanzi', '咖啡')
    );
});

it('can filter vocabs with search query without tonal marks', function () {
    Vocab::create([
        'hanzi' => '谢谢',
        'pinyin' => 'xiè xie',
        'meaning' => 'Terima kasih',
    ]);

    $response = $this->get(route('vocabs.index', ['search' => 'xie xie']));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Vocabs/Index')
        ->has('vocabs', 1)
        ->where('vocabs.0.hanzi', '谢谢')
    );
});

it('can filter vocabs with search query without spaces or tone marks', function () {
    Vocab::create([
        'hanzi' => '你好',
        'pinyin' => 'nǐ hǎo',
        'meaning' => 'Halo / Apa kabar',
    ]);

    $response = $this->get(route('vocabs.index', ['search' => 'nihao']));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Vocabs/Index')
        ->has('vocabs', 1)
        ->where('vocabs.0.hanzi', '你好')
    );
});

it('allows storing and updating dibaca column', function () {
    $user = User::factory()->create();

    $payload = [
        'hanzi' => '爸爸',
        'pinyin' => 'bà ba',
        'dibaca' => 'pa pa',
        'meaning' => 'Ayah',
        'notes' => 'Panggilan untuk ayah',
    ];

    $response = $this->actingAs($user)->post(route('vocabs.store'), $payload);

    $response->assertRedirect(route('vocabs.index'));
    $this->assertDatabaseHas('vocabs', [
        'hanzi' => '爸爸',
        'dibaca' => 'pa pa',
    ]);

    $vocab = Vocab::where('hanzi', '爸爸')->first();

    $updateResponse = $this->actingAs($user)->put(route('vocabs.update', $vocab), [
        'hanzi' => '爸爸',
        'pinyin' => 'bà ba',
        'dibaca' => 'pa-pa',
        'meaning' => 'Ayah tercinta',
    ]);

    $updateResponse->assertRedirect(route('vocabs.index'));
    $this->assertDatabaseHas('vocabs', [
        'id' => $vocab->id,
        'dibaca' => 'pa-pa',
        'meaning' => 'Ayah tercinta',
    ]);
});

it('can filter vocabs using dibaca column', function () {
    Vocab::create([
        'hanzi' => '苹果',
        'pinyin' => 'píng guǒ',
        'dibaca' => 'phing kwo',
        'meaning' => 'Apel',
    ]);

    $response = $this->get(route('vocabs.index', ['search' => 'phing kwo']));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Vocabs/Index')
        ->has('vocabs', 1)
        ->where('vocabs.0.hanzi', '苹果')
        ->where('vocabs.0.dibaca', 'phing kwo')
    );
});

