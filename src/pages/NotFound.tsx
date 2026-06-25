import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <SEO title="Page Not Found" description="The page you are looking for could not be found." noindex />
      <div className="min-h-screen pt-20 px-6 lg:px-12">
        <div className="container mx-auto max-w-2xl py-24 text-center">
          <p className="font-serif text-6xl mb-4">404</p>
          <h1 className="font-serif text-3xl mb-4">This page could not be found</h1>
          <p className="text-lg text-muted-foreground mb-8">
            The page you were looking for may have moved or no longer exists. We would
            be glad to help you find your way.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/">Return Home</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">Request a Private Consultation</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
