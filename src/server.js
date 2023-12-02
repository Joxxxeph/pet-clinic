import app from './app.js';
import { authenticated, syncUp } from './config/database/database.js';
import { envs } from './config/enviroments/enviroments.js'

async function main(){
    try {
        await authenticated()
        await syncUp()
    } catch (error) {
        console.error(error)
    }
}

app.listen(envs.PORT, () => {
    console.log(`Server runing on port http://localhost${envs.PORT}`)
});

main()