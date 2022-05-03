import { getInput } from "@actions/core"
import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"

const file = process.cwd() + "/" + getInput("ORIGIN_PATH")

const supabase = createClient(
  getInput("SUPABASE_URL"),
  getInput("SUPABASE_ANON_KEY")
)

async function run() {
  if (getInput("EMAIL") !== "") {
    const { error0 } = await supabase.auth.signIn({
      email: getInput("EMAIL"),
      password: getInput("PASSWORD"),
    })

    if (error0) {
      console.log(error0)
    } else {
      console.log("Logged in as: ", getInput("EMAIL"))
    }
  }

  const { error1 } = await supabase.storage
    .from(getInput("BUCKET"))
    .upload(getInput("TARGET_PATH"), readFileSync(file))

  if (error1) {
    console.log(error1)
  } else {
    console.log("File uploaded.")
  }

  if (getInput("EMAIL") !== "") {
    const { error2 } = await supabase.auth.signOut()
    if (error2) {
      console.log(error2)
    } else {
      console.log("Logged out of ", getInput("EMAIL"))
    }
  }
}

run()
