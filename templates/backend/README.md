# Backend

> このディレクトリは Dev がバックエンド実装を配置する場所です。

## 想定構成

```
backend/
├── functions/          # Lambda 関数等
├── requirements.txt    # Python 依存（Lambda の場合）
└── ...
```

## フロントエンドとの連携

- フロントエンドは `frontend/src/services/repositories/` でモックデータを使用しています
- 本番 API が完成したら、モックを実 API 呼び出しに差し替えてください
- API のエンドポイント定義は `frontend/src/services/repositories/` 内のファイルを参照

## 注意

- このディレクトリの実装はデザイナーのスコープ外です
- バックエンド実装は Dev チームが担当します
