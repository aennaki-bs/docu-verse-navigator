
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DocuVerseLogo from '@/components/DocuVerseLogo';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center">
        <DocuVerseLogo className="mx-auto h-12 w-auto mb-8" />
        <h1 className="text-9xl font-bold text-docuBlue">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Page not found</h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <div className="mt-8">
          <Link to="/">
            <Button className="bg-docuBlue hover:bg-docuBlue-700">
              Return to home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
