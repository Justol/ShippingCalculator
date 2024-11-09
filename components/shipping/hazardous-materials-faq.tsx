import { Accordion } from "@/components/ui/accordion";

export default function HazardousMaterialsFAQ() {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold">Hazardous Materials FAQ</h3>
      <Accordion title="Domestic Shipping Prohibitions, Restrictions, & HAZMAT">
        <p>
          When you mail a letter or send a package, you must follow U.S. and USPS® guidelines. Learn what things you can and can't send in the U.S. mail:
        </p>
        <ul className="list-disc pl-5">
          <li>Some items are prohibited (completely forbidden).</li>
          <li>Some are restricted (allowed under certain conditions).</li>
          <li>Hazardous materials (HAZMAT) might be prohibited or restricted.</li>
        </ul>
        <p>
          If you're shipping internationally, see International Shipping Prohibitions & Restrictions.
        </p>
      </Accordion>
      <Accordion title="Shipping Hazardous Materials (HAZMAT)">
        <p>
          Hazardous materials are substances that could injure people or cause damage if not handled properly, like chemicals or flammable items. HAZMAT also includes lithium batteries and liquid mercury.
        </p>
        <ul className="list-disc pl-5">
          <li>Some HAZMAT is prohibited—you can’t send it through USPS and must use another carrier.</li>
          <li>Other HAZMAT is restricted—you can mail it if you follow all the rules.</li>
          <li>Some HAZMAT can only be sent by ground transportation—it can’t go on airplanes.</li>
        </ul>
        <p>
          If you are mailing packages that contain hazardous materials, you must separate them from all other packages and present them in a container marked "HAZMAT."
        </p>
      </Accordion>
      <Accordion title="Examples of Prohibited Items">
        <ul className="list-disc pl-5">
          <li>Air Bags</li>
          <li>Ammunition</li>
          <li>Explosives</li>
          <li>Gasoline</li>
          <li>Liquid Mercury</li>
          <li>Marijuana (medical or otherwise)</li>
          <li>Fireworks</li>
          <li>Flares</li>
          <li>Matches</li>
          <li>Poison</li>
        </ul>
      </Accordion>
      <Accordion title="Examples of Restricted Items">
        <ul className="list-disc pl-5">
          <li>Aerosols (e.g., propane, butane)</li>
          <li>Alcoholic Beverages</li>
          <li>Cigarettes, Cigars, & Tobacco</li>
          <li>Dry Ice</li>
          <li>Firearms</li>
          <li>Glues</li>
          <li>Hand Sanitizer</li>
          <li>Lithium Batteries</li>
          <li>Paint</li>
          <li>Perfumes</li>
          <li>Biological Samples</li>
          <li>Corrosive Materials</li>
          <li>Magnetized Materials</li>
        </ul>
      </Accordion>
      <Accordion title="Important Notes">
        <p>
          - Blue ice and gel packs are non-hazardous (not DG).
        </p>
        <p>
          - Firearms without ammunition are not considered dangerous goods.
        </p>
        <p>
          - Mercury is prohibited in any form, but items with small amounts of mercury vapor, like compact fluorescent lamps, can be mailed domestically.
        </p>
        <p>
          - If you knowingly mail dangerous materials, you face severe penalties, including fines and criminal charges.
        </p>
      </Accordion>
    </div>
  );
} 