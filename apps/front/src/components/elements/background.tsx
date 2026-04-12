import { backgroundItems, roleGatewayStyles } from "@/utils/style";

export const Background = () => {
  return (
    <>
      <div aria-hidden="true" className={roleGatewayStyles.background.spheres}>
        {backgroundItems.spheres.map((itemClass, index) => (
          <div
            key={`sphere-${index}`}
            className={`${roleGatewayStyles.background.sphereBase} ${itemClass}`}
          />
        ))}

        {backgroundItems.spheres.map((itemClass, index) => (
          <div
            key={`orb-${index}`}
            className={`${roleGatewayStyles.background.sphereBase} ${itemClass}`}
          />
        ))}

        {backgroundItems.orbs.map((itemClass, index) => (
          <div
            key={`orb-${index}`}
            className={`${roleGatewayStyles.background.gradientOrb} ${itemClass}`}
          />
        ))}
      </div>

      <div
        aria-hidden="true"
        className={roleGatewayStyles.background.gridPattern}
      />
    </>
  );
};
