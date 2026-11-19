import type { ComponentProps } from "react";

import errorArt from "~/assets/errors/error-art.svg";
import { CheckautoLogo } from "~/shared/components/checkauto-logo";
import { cn } from "~/shared/lib/utils";

function ErrorPage({ className, children, ...props }: ComponentProps<"main">) {
	return (
		<div className="flex min-h-dvh flex-col bg-background">
			<header className="mx-auto w-full max-w-6xl px-4 pt-4 sm:px-8 lg:pt-8">
				<CheckautoLogo className="h-6" />
			</header>
			<main
				id="conteudo"
				className={cn(
					"mx-auto grid w-full max-w-6xl flex-1 grid-cols-[minmax(0,1fr)] content-center items-center gap-10 px-4 pt-8 pb-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:py-12",
					className,
				)}
				{...props}
			>
				{children}
			</main>
		</div>
	);
}

function ErrorPageContent({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn("flex flex-col items-start gap-4", className)}
			{...props}
		/>
	);
}

function ErrorPageTitle({ className, ...props }: ComponentProps<"h1">) {
	return (
		<h1
			className={cn(
				"max-w-[18ch] text-3xl/tight font-medium tracking-tight text-heading lg:text-4xl/tight",
				className,
			)}
			{...props}
		/>
	);
}

function ErrorPageDescription({ className, ...props }: ComponentProps<"p">) {
	return (
		<p
			className={cn(
				"max-w-[44ch] text-base/7 text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}

function ErrorPageActions({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"flex w-full flex-col gap-3 pt-4 sm:w-auto sm:flex-row",
				className,
			)}
			{...props}
		/>
	);
}

function ErrorPageDetails({
	className,
	children,
	...props
}: ComponentProps<"pre">) {
	return (
		<pre
			className={cn(
				"mt-6 max-h-64 w-full overflow-auto rounded-2xl bg-muted p-4 text-xs/5 text-heading/80",
				className,
			)}
			{...props}
		>
			<code>{children}</code>
		</pre>
	);
}

function ErrorPageArt({ className, ...props }: ComponentProps<"img">) {
	return (
		<img
			src={errorArt}
			alt=""
			width={480}
			height={480}
			className={cn(
				"mx-auto w-full max-w-72 sm:max-w-96 lg:max-w-110",
				className,
			)}
			{...props}
		/>
	);
}

export {
	ErrorPage,
	ErrorPageActions,
	ErrorPageArt,
	ErrorPageContent,
	ErrorPageDescription,
	ErrorPageDetails,
	ErrorPageTitle,
};
