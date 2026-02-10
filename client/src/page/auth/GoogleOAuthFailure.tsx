import LogoName from "@/components/logo/logo-and-name";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const GoogleOAuthFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">

        <LogoName />

        <Card>
          <CardContent>
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <h1>Authentication Failed</h1>
              <p>We couldn't sign you in with Google. Please try again.</p>

              <Button onClick={() => navigate("/")} style={{ marginTop: "20px" }}>
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoogleOAuthFailure;
