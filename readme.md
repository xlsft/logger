# Logger

## This module contains logger class for formatting log strings

### Example use

```ts
    // main.ts

    import { Logger } from "@xlsoftware/logger";

    export const log = new Logger()
```

```ts
    // module.ts
    
    import { log } from "./main.ts";

    log.log('module.ts is up and running', 'module.ts')
```

```
    [08.03.2024, 21:07:21.64] (module.ts): module.ts is up and running
```