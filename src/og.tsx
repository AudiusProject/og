import { Context, Hono } from 'hono';
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api';
import { getLocalFonts } from './getFonts';
import { loadImage } from './loadImage';

const app = new Hono();

interface UserData {
	data?: {
		id: string;
	};
}

interface Challenge {
	challenge_id: string;
	current_step_count: number;
}

interface ChallengeData {
	data?: Challenge[];
}

async function fetchAllocation(c: Context, handle: string): Promise<number | null> {
	if (!handle) return null;
	const baseUrl = c.env.API_URL;

	try {
		const userResponse = await fetch(`${baseUrl}/v1/users/handle/${handle}`);
		const userData: UserData = await userResponse.json();

		if (!userData?.data?.id) return null;

		const challengesResponse = await fetch(`${baseUrl}/v1/users/${userData.data.id}/challenges`);
		const challengeData: ChallengeData = await challengesResponse.json();

		const totalAllocation = challengeData?.data?.find((c) => c.challenge_id === 'o')?.current_step_count ?? 0;

		return totalAllocation;
	} catch (error) {
		console.error('Error fetching user data:', error);
		return null;
	}
}

app.on('GET', ['/airdrop/', '/airdrop/:handle?'], async (c) => {
	try {
		const handle = c.req.param('handle');
		const totalAllocation = handle ? await fetchAllocation(c, handle) : null;

		const firstLine = handle ? `@${handle}` : '';
		const secondLine =
			totalAllocation !== null
				? `${Number(totalAllocation).toLocaleString()} $AUDIO`
				: 'Airdrop 2: Artist Appreciation';

		const font = await getLocalFonts(c, [{ path: 'Inter-Bold.ttf', weight: 700 }]);

		async function renderOGImage() {
			const backgroundImage = await loadImage(c, '/images/airdrop.png');

			return (
				<div
					style={{
						width: '100%',
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						position: 'relative',
					}}
				>
					<img
						src={backgroundImage || ''}
						alt="Background"
						style={{
							position: 'absolute',
							width: '100%',
							height: '100%',
							objectFit: 'cover',
						}}
					/>
					<div
						style={{
							position: 'relative',
							padding: '48px',
							display: 'flex',
							flexDirection: 'column',
							height: '100%',
						}}
					>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'flex-start',
								justifyContent: 'center',
								flex: 1,
								paddingLeft: '300px',
							}}
						>
							<div tw="text-7xl font-bold text-white text-left mb-4">{firstLine}</div>
							<div tw="text-7xl font-bold text-white text-left">{secondLine}</div>
						</div>
					</div>
				</div>
			);
		}

		return new ImageResponse(await renderOGImage(), {
			width: 1200,
			height: 630,
			fonts: Array.isArray(font) ? [...font] : [font],
		});
	} catch (error: any) {
		console.error('OG Image generation error:', error);
		return c.json({ error: 'Failed to generate image', details: error.message }, 500);
	}
});

// TODO: Add types for the models
type CommentResponse = {
	data: any;
	related: { tracks: any[]; users: any[] };
};

type CommentData = {
	comment: any;
	track: any;
	user: any;
};

export const getCommentDataById = async (c: Context, id: string): Promise<CommentData> => {
	const baseUrl = c.env.API_URL;
	const url = `${baseUrl}/v1/full/comments/${id}`;
	const res = await fetch(url);
	const { data, related } = (await res.json()) as CommentResponse;
	const comment = Array.isArray(data) ? data[0] : data;

	if (!comment) throw new Error(`Failed to get comment ${id}`);

	const track = related.tracks.find((t: any) => t.id === comment.entity_id);
	const user = related.users.find((u: any) => u.id === comment.user_id);

	return {
		comment,
		track,
		user,
	};
};

const getBadgeTier = (balance: number) => {
	let tier = null;
	if (balance >= 10000) {
		tier = 'Platinum';
	} else if (balance >= 1000) {
		tier = 'Gold';
	} else if (balance >= 100) {
		tier = 'Silver';
	} else if (balance >= 10) {
		tier = 'Bronze';
	}

	return tier;
};

const renderCommentOGImage = async (c: Context, commentId: string) => {
	const { comment, track, user } = await getCommentDataById(c, commentId);

	const trackName = track.title;
	const artistName = track.user.name;
	const isArtistVerified = track.user.is_verified;
	const artistTier = getBadgeTier(track.user.total_audio_balance);

	const commentText = comment.message;
	const commenterName = user.name;
	const isCommenterVerified = user.is_verified;
	const commenterTier = getBadgeTier(user.total_audio_balance);

	const [
		trackArtwork,
		userProfilePicture,
		audiusLogo,
		verifiedIcon,
		verifiedIconWhite,
		artistTierIcon,
		commenterTierIcon,
	] = await Promise.all([
		loadImage(c, track.artwork['150x150']),
		loadImage(c, user.profile_picture['150x150']),
		loadImage(c, '/icons/AudiusLogoHorizontal.svg'),
		isCommenterVerified ? loadImage(c, '/icons/Verified.svg') : null,
		isArtistVerified ? loadImage(c, '/icons/VerifiedWhite.svg') : null,
		artistTier ? loadImage(c, `/icons/Token${artistTier}.svg`) : null,
		commenterTier ? loadImage(c, `/icons/Token${commenterTier}.svg`) : null,
	]);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				width: '100%',
				backgroundColor: '#FFF',
			}}
		>
			<div
				style={{
					display: 'flex',
					gap: '40px',
					padding: '40px',
					justifyContent: 'space-between',
					background: 'linear-gradient(-22deg, #5b23e1 0%, #a22feb 100%)',
					boxSizing: 'border-box',
				}}
			>
				<div
					style={{
						display: 'flex',
						flex: '1 1 0',
						flexDirection: 'row',
						gap: '24px',
						alignItems: 'center',
					}}
				>
					{trackArtwork ? (
						<img
							src={trackArtwork}
							alt="Track Artwork"
							height={120}
							width={120}
							style={{ width: '120px', height: '120px', borderRadius: '10px' }}
						/>
					) : null}
					<div
						style={{
							display: 'flex',
							flex: '1 1 0',
							flexDirection: 'column',
							gap: '4px',
							height: '120px',
							paddingTop: '4px',
							alignSelf: 'center',
						}}
					>
						<h2
							style={{
								margin: 0,
								color: '#FFF',
								fontSize: '48px',
								fontWeight: '800',
								lineHeight: '54px',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
						>
							{trackName}
						</h2>

						<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
							<p
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '8px',
									margin: 0,
									color: '#FFF',
									fontSize: '40px',
									fontWeight: '300',
									lineHeight: '48px',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
								}}
							>
								By {artistName}
							</p>
							<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
								{isArtistVerified && verifiedIconWhite ? (
									<img
										src={verifiedIconWhite}
										alt="Verified"
										height={32}
										width={32}
										style={{ width: '32px', height: '32px', flexBasis: '32px' }}
									/>
								) : null}
								{artistTier && artistTierIcon ? (
									<img
										src={artistTierIcon}
										alt="Artist Tier"
										height={32}
										width={32}
										style={{ width: '32px', height: '32px', flexBasis: '32px' }}
									/>
								) : null}
							</div>
						</div>
					</div>
				</div>
				<div style={{ display: 'flex', alignSelf: 'flex-start', width: '200px' }}>
					{audiusLogo ? (
						<img
							src={audiusLogo}
							alt="Audius Logo"
							height={48}
							width={200}
							style={{ width: '200px' }}
						/>
					) : null}
				</div>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					flexGrow: 1,
					width: '100%',
					padding: '40px',
					justifyContent: 'center',
					boxSizing: 'border-box',
				}}
			>
				<div
					style={{
						display: 'flex',
						gap: '32px',
						alignContent: 'center',
					}}
				>
					<div style={{ display: 'flex', alignSelf: 'flex-start', flexBasis: '128px' }}>
						{userProfilePicture ? (
							<img
								src={userProfilePicture}
								alt="Profile Picture"
								height={128}
								width={128}
								style={{ width: '128px', height: '128px', borderRadius: '50%' }}
							/>
						) : null}
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							flex: '1 1 0',
							gap: '16px',
						}}
					>
						<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
							<h2
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '8px',
									margin: 0,
									color: '#524F62',
									fontSize: '60px',
									fontStyle: 'normal',
									fontWeight: '700',
									lineHeight: '64px',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
								}}
							>
								{commenterName}
							</h2>
							<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
								{isCommenterVerified && verifiedIcon ? (
									<img
										src={verifiedIcon}
										alt="Verified"
										height={52}
										width={52}
										style={{ width: '52px', height: '52px' }}
									/>
								) : null}
								{commenterTier && commenterTierIcon ? (
									<img
										src={commenterTierIcon}
										alt="Commenter Tier"
										height={52}
										width={52}
										style={{ width: '52px', height: '52px' }}
									/>
								) : null}
							</div>
						</div>
						<p
							style={{
								margin: 0,
								color: '#524F62',
								fontSize: '48px',
								fontStyle: 'normal',
								fontWeight: '500',
								lineHeight: '72px',
							}}
						>
							{commentText}
							{/* Element to fade out text after 4 lines */}
							<div
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									right: 0,
									height: '360px',
									background:
										'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 60%, rgba(255, 255, 255, 1) 75%, rgba(255, 255, 255, 1) 100%)',
								}}
							></div>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

const renderTrackOGImage = async (c: Context, trackId: string) => {
	return (
		<div tw="flex flex-col items-center justify-center">
			<h1>Track</h1>
			<p>Description for track OG image</p>
			<p>Track Id: {trackId}</p>
		</div>
	);
};

const renderUserOGImage = async (c: Context, userId: string) => {
	return (
		<div tw="flex flex-col items-center justify-center">
			<h1>User</h1>
			<p>Description for user OG image</p>
			<p>User Id: {userId}</p>
		</div>
	);
};

const renderDefaultOGImage = async (c: Context, id: string) => {
	return (
		<div tw="flex flex-col items-center justify-center">
			<h1>Default</h1>
		</div>
	);
};

const typeMap = {
	comment: renderCommentOGImage,
	track: renderTrackOGImage,
	user: renderUserOGImage,
};

app.on('GET', ['/og', '/og/:type/:id'], async (c) => {
	try {
		const type = c.req.param('type');
		const id = c.req.param('id');

		const font = await getLocalFonts(c, [
			{ path: 'Inter-Bold.ttf', weight: 700 },
			{ path: 'Inter-Regular.ttf', weight: 500 },
			{ path: 'Inter-Light.ttf', weight: 300 },
		]);

		const renderImage = type && type in typeMap ? typeMap[type as keyof typeof typeMap] : renderDefaultOGImage;

		return new ImageResponse(await renderImage(c, id), {
			width: 1200,
			height: 630,
			fonts: Array.isArray(font) ? [...font] : [font],
		});
	} catch (error: any) {
		console.error('OG Image generation error:', error);
		return c.json({ error: 'Failed to generate image', details: error.message ?? String(error) }, 500);
	}
});

export default app;
