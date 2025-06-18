# DBテーブル設計.md

## users

| カラム名            | 型       | 制約             |
| ------------------- | -------- | ---------------- |
| id                  | bigint   | primary key      |
| name                | string   | not null         |
| email               | string   | unique, not null |
| encrypted\_password | string   | not null         |
| jti                 | string   | unique, not null |
| created\_at         | datetime |                  |
| updated\_at         | datetime |                  |

## interactions（旧 sessions）

| カラム名   | 型       | 制約             |
| ---------- | -------- | ---------------- |
| id         | bigint   | primary key      |
| code       | string   | unique, not null |
| created_at | datetime |                  |
| updated_at | datetime |                  |

## interaction_states（最新スナップショット）

| カラム名       | 型       | 制約        |
| -------------- | -------- | ----------- |
| id             | bigint   | primary key |
| interaction_id | bigint   | foreign key |
| user_id        | bigint   | foreign key |
| status         | string   |             |
| counter        | integer  | default: 0  |
| updated_at     | datetime |             |

## state_events（履歴テーブル）

| カラム名       | 型       | 制約        |
| -------------- | -------- | ----------- |
| id             | bigint   | primary key |
| interaction_id | bigint   | foreign key |
| user_id        | bigint   | foreign key |
| status         | string   |             |
| counter        | integer  |             |
| created_at     | datetime |             |

## 認証関連

### POST /signup

- 新規ユーザー登録
- リクエスト: `{ name, email, password, password_confirmation }`
- レスポンス: `{ user, token }`

### POST /login

- ユーザーログイン（JWT取得）
- リクエスト: `{ email, password }`
- レスポンス: `{ user } + ヘッダ: Authorization: Bearer <JWT>`

### DELETE /logout

- ログアウト（JWT失効）

---

## インタラクション関連

### POST /interactions

- 新しいセッション作成（コード生成）
- レスポンス: `{ interaction_code }`

### GET /interactions/\:id

- セッション状態の取得

---

## カウンター共有

### GET /interactions/\:id/counter

- 現在のカウント値を取得

### PATCH /interactions/\:id/counter

- カウンターを更新
- リクエスト: `{ counter: number }`
- レスポンス: `{ counter: number }`

---

## 心理状態共有

### PATCH /interactions/\:id/state

- ステータス更新（例：😊）
- リクエスト: `{ status: "thinking" }`

---

## WebSocket接続

### ws\:///cable

- チャンネル: `InteractionChannel`
- パラメータ: `{ interaction_id: string }`
- サーバーからの通知例:

```json
{
  "type": "status",
  "user_id": 1,
  "status": "relaxed"
}
```

```json
{
  "type": "counter",
  "counter": 7
}
```

