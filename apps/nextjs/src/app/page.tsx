import { Quote } from "./_components/quote";

export default async function HomePage(): Promise<React.ReactElement> {

  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1>Heading one</h1>
        <h2>Heading two</h2>
        <Quote text="Hello there, my name is Jeremy Clarkson" startTime={100} endTime={100} id={123} />
      </div>
    </main>
  );
}
