import jenkins.model.*
import hudson.security.HudsonPrivateSecurityRealm

def jenkins = Jenkins.get()
def realm = jenkins.getSecurityRealm()

if (realm instanceof HudsonPrivateSecurityRealm) {
    def user = realm.getUser("admin")

    if (user != null) {
        def details = user.getProperty(hudson.security.HudsonPrivateSecurityRealm.Details.class)

        if (details != null) {
            details.setPassword("Admin@12345")
            user.save()
            println("====================================")
            println("ADMIN PASSWORD RESET SUCCESSFULLY")
            println("Username: admin")
            println("Password: Admin@12345")
            println("====================================")
        } else {
            println("Could not find password details for admin")
        }
    } else {
        println("User admin not found")
    }
}
