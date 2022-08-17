import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';


import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "./lib/mongodb"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    // https://next-auth.js.org/providers/overview
    providers: [
        TwitterProvider({
            clientId: process.env.TWITTER_CONSUMER_KEY,
            clientSecret: process.env.TWITTER_CONSUMER_SECRET
        })
    ],
    theme: {
        colorScheme: "dark", // "auto" | "dark" | "light"
        brandColor: "#FFFFFF",
    },
    secret: process.env.NEXTAUTH_SECRET,
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        encryption: true
    },

    callbacks: {

        async jwt({ token, account, profile, }) {
            if (account) {
                token.account = account;
            }

            if (profile) {
                token.profile = profile;
            }

            return token
        },

        async session({ session, token, user }) {
            if (session.user) {
                session = {

                    ...session,
                    user: {
                        id: user.id,
                        username: user.username,
                        ...session.user
                    }
                }
            }
            console.log('session -->', session)
            console.log('token -->', token)
            return session
        }
    },
    pages: {
        error: '/error', // Error code passed in query string as ?error=
    },
    debug: true,

});
