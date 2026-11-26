import { useState } from "react";

import ring from "~/assets/brand/symbol-ring-blue.webp";
import { User2Icon } from "~/shared/components/icons";
import { cn } from "~/shared/lib/utils";

type BrandAvatarProps = {
	className?: string;
	src?: string;
};

export function BrandAvatar({ className, src }: BrandAvatarProps) {
	const [failedSrc, setFailedSrc] = useState<string | null>(null);
	const picture = src && src !== failedSrc ? src : null;

	return (
		<span
			aria-hidden="true"
			className={cn("@container relative block size-11 shrink-0", className)}
		>
			<span
				style={{
					maskImage: `url(${ring}), radial-gradient(circle closest-side, transparent 81%, #000 81.5%)`,
				}}
				className="absolute inset-0 bg-brand-green mask-intersect mask-contain mask-center mask-no-repeat"
			/>
			<span className="absolute inset-[13%] flex items-center justify-center overflow-hidden rounded-full bg-brand-blue text-[27cqw] font-semibold tracking-wide text-white">
				{picture ? (
					<img
						src={picture}
						alt=""
						referrerPolicy="no-referrer"
						onError={() => setFailedSrc(picture)}
						className="size-full object-cover"
					/>
				) : (
					<User2Icon />
				)}
			</span>
		</span>
	);
}
