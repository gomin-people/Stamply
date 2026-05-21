type BrochurePageProps = {
    params: Promise<{ slug: string }>;
}

const BrochurePage = async ({ params }: BrochurePageProps) => {
    const { slug } = await params;

    return (
        <main>
            브로셔
        </main>
    );
}

export default BrochurePage
