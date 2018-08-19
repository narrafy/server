/*

app.get('/api/migrate/customer', async(req, res) => {
    await mig.migrateCustomer();
})

app.get('/api/migrate/conversation', async(req, res) => {
    await mig.migrateConversation();
})

app.get('/api/migrate/story', async(req, res) => {
    await mig.migrateStory();
})

app.get('/api/migrate/template', async(req, res) => {
    await mig.migrateStoryTemplate();
})

app.get('/api/migrate/subscriber', async(req, res) => {
    await mig.migrateSubscriber();
})

app.get('/api/migrate/transcript', async(req, res) => {
    await mig.migrateTranscript();
})
*/

module.exports = {
    development: {
        client: 'pg',
        connection:'postgres://localhost/narrafy',
        migrations: {
            directory: './app/service/db/migrations'
        },
        seeds: {
            directory: './app/service/db/seeds/dev'
        },
        useNullAsDefault: true
    },

    test: {
        client: 'pg',
        connection:'postgres://localhost/narrafy',
        migrations: {
            directory: './db/migrations'
        },
        seeds: {
            directory: './db/seeds/test'
        },
        useNullAsDefault: true
    },

    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: './app/service/db/migrations'
        },
        seeds: {
            directory: './app/service/db/seeds/production'
        },
        useNullAsDefault: true
    }
};