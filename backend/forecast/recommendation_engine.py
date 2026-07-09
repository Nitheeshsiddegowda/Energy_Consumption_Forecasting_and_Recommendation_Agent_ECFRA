def generate_recommendations(appliances, tariff_rate):

    recommendations = []

    total_units = sum(item["units"] for item in appliances)

    for item in appliances:

        percentage = (item["units"] / total_units) * 100 if total_units else 0

        saving_units = round(item["units"] * 0.10, 2)
        saving_bill = round(saving_units * tariff_rate, 2)

        # Air Conditioner
        if item["name"] == "AirConditioner" and percentage > 30:
            recommendations.append({
                "title": "⚠ High Air Conditioner Usage",
                "message": "Reduce AC usage by approximately 1 hour/day or increase the temperature by 1-2°C.",
                "saving_units": saving_units,
                "saving_bill": saving_bill
            })

        # Refrigerator
        elif item["name"] == "Refrigerator" and percentage > 20:
            recommendations.append({
                "title": "💡 Refrigerator Optimization",
                "message": "Keep refrigerator temperature between 3°C and 5°C and avoid frequent door opening.",
                "saving_units": saving_units,
                "saving_bill": saving_bill
            })

        # Television
        elif item["name"] == "Television" and percentage > 8:
            recommendations.append({
                "title": "📺 Television Usage",
                "message": "Turn off the TV completely instead of leaving it on standby.",
                "saving_units": saving_units,
                "saving_bill": saving_bill
            })

        # Fan
        elif item["name"] == "Fan" and percentage > 10:
            recommendations.append({
                "title": "🌀 Fan Usage",
                "message": "Switch off fans when rooms are unoccupied.",
                "saving_units": saving_units,
                "saving_bill": saving_bill
            })

        # Motor Pump
        elif item["name"] == "MotorPump" and percentage > 8:
            recommendations.append({
                "title": "🚰 Motor Pump",
                "message": "Operate the motor pump only when required and avoid overflow.",
                "saving_units": saving_units,
                "saving_bill": saving_bill
            })

    return recommendations