# zod スキーマから型定義を作成する

サンプルコード

```js
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { users } from "../db/schema";

// 基本型
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
```
