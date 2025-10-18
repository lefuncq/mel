import { cn } from "@/lib/utils";
import { Parallax } from "../Parallax/Parallax";

function Section({
	id,
	children,
	extraChildren,
	className,
	contentWrapperClassName,
}: {
	id?: string;
	children: React.ReactNode;
	extraChildren?: React.ReactNode;
	contentWrapperClassName?: string;
	className?: string;
}) {
	return (
		<section
			id={id}
			className={cn(
				"w-screen min-h-screen h-full md:h-fit",
				"flex items-center justify-center relative",
				"py-10 md:py-20",
				className,
			)}
		>
			{extraChildren}
			{/* <Parallax
				shiftRem={22}
				strength={130} // <- bump this until it “reads”
				speed={0.3}
				as="div"
				className={cn(
					"md:py-20",
					"max-h-svh md:max-h-none md:min-h-[calc(90vh-64px)]",
					"content-wrapper",
					"grid grid-rows-[min-content_1fr_min-content]",
					"md:grid-rows-[min-content_1fr_min-content]",
					"md:border md:border-foreground md:w-fit md:rounded-4xl",
					"gap-10 items-center justify-center",
					contentWrapperClassName,
				)}
			>
				{children}
			</Parallax> */}
			<div
				className={cn(
					"md:py-20",
					"max-h-svh min-h-[500px] md:max-h-none md:min-h-[calc(90vh-64px)]",
					"content-wrapper",
					"grid grid-rows-[min-content_1fr_min-content]",
					"md:grid-rows-[min-content_1fr_min-content]",
					"md:border md:border-foreground",
					"md:w-fit md:rounded-4xl",
					"gap-10 items-center justify-center",
					contentWrapperClassName,
				)}
			>
				{children}
			</div>
		</section>
	);
}

export default Section;
